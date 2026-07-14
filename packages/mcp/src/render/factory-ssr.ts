/**
 * Factory-SSR pipeline (proven GO by the spike:
 * spike/factory-ssr.spike.test.ts, spike/FINDINGS.md). Bundles one generated
 * component from an in-memory export with esbuild against a virtual
 * filesystem (no disk writes), evaluates the CJS bundle with a minimal
 * `require` shim, and renders it with `renderToStaticMarkup`. The preview is
 * production output by construction — same export, same generated source,
 * same React render — not a bespoke approximation.
 */
import path from "node:path"

import { getComponentName } from "@seldon/factory/export/react/discovery/get-component-name"
import { pluralizeLevel } from "@seldon/factory/export/react/utils/pluralize-level"
import type { FileToExport } from "@seldon/factory/export/types"
import esbuild from "esbuild"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import * as jsxRuntime from "react/jsx-runtime"

import { getComponentSchema } from "@seldon/core/components/catalog"
import type { ComponentId } from "@seldon/core/components/constants"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import type { EntryNode, Workspace } from "@seldon/core/workspace/types"

/** Node modules the bundle may `require`; nothing else is available. */
const EXTERNAL_MODULES: Record<string, unknown> = {
  react: React,
  "react/jsx-runtime": jsxRuntime,
}

/** Resolves an import specifier against the in-memory export file map. */
function makeVirtualResolver(files: ReadonlyMap<string, FileToExport>) {
  const candidates = (base: string) => [
    base,
    `${base}.tsx`,
    `${base}.ts`,
    `${base}.jsx`,
    `${base}.js`,
    `${base}/index.tsx`,
    `${base}/index.ts`,
  ]
  return (specifier: string, importer?: string): string | null => {
    const base = specifier.startsWith(".")
      ? path.posix.join(path.posix.dirname(importer ?? "/"), specifier)
      : specifier
    for (const candidate of candidates(base)) {
      if (files.has(candidate)) return candidate
    }
    return null
  }
}

function virtualExportPlugin(
  files: ReadonlyMap<string, FileToExport>,
): esbuild.Plugin {
  const resolve = makeVirtualResolver(files)
  return {
    name: "seldon-virtual-export",
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.path in EXTERNAL_MODULES) {
          return { path: args.path, external: true }
        }
        const resolved = resolve(
          args.path,
          args.namespace === "virtual" ? args.importer : undefined,
        )
        if (resolved) return { path: resolved, namespace: "virtual" }
        return {
          errors: [
            {
              text: `not in the virtual export: ${args.path} (imported by ${args.importer || "entry"})`,
            },
          ],
        }
      })
      build.onLoad({ filter: /.*/, namespace: "virtual" }, (args) => {
        const file = files.get(args.path)!
        if (typeof file.content !== "string") {
          return {
            contents: new Uint8Array(file.content),
            loader: "binary" as const,
          }
        }
        if (args.path.endsWith(".css")) {
          return { contents: file.content, loader: "empty" as const }
        }
        const loader = args.path.endsWith(".tsx")
          ? ("tsx" as const)
          : args.path.endsWith(".ts")
            ? ("ts" as const)
            : ("js" as const)
        return { contents: file.content, loader }
      })
    },
  }
}

/** Bundles one generated component to CJS and evaluates it in-process. */
async function loadComponent(
  files: ReadonlyMap<string, FileToExport>,
  entryPath: string,
): Promise<Record<string, unknown>> {
  let result: esbuild.BuildResult
  try {
    result = await esbuild.build({
      entryPoints: [entryPath],
      bundle: true,
      write: false,
      format: "cjs",
      platform: "node",
      jsx: "automatic",
      logLevel: "silent",
      plugins: [virtualExportPlugin(files)],
    })
  } catch (error) {
    throw new Error(
      `Failed to bundle "${entryPath}" from the in-memory export: ${(error as Error).message}`,
    )
  }
  const code = result.outputFiles?.[0]?.text
  if (code === undefined) {
    throw new Error(`esbuild produced no output for "${entryPath}".`)
  }
  const moduleShim = { exports: {} as Record<string, unknown> }
  const requireShim = (id: string) => {
    if (id in EXTERNAL_MODULES) return EXTERNAL_MODULES[id]
    throw new Error(`unexpected external require: ${id}`)
  }
  new Function("require", "module", "exports", code)(
    requireShim,
    moduleShim,
    moduleShim.exports,
  )
  return moduleShim.exports
}

/**
 * Locates a variant's generated component file in an export's file map,
 * recomputing the same output path `getComponentsToExport`
 * (@seldon/factory/export/react/discovery/get-components-to-export) derives
 * internally — via the same two small, pure helpers it uses
 * (`getComponentName`, `pluralizeLevel`) — rather than reaching into that
 * module's internal generation pipeline (which needs `nodeIdToClass`, itself
 * built from `buildStyleRegistry`, not a public entry point).
 */
export function findComponentFile(
  files: ReadonlyMap<string, FileToExport>,
  workspace: Workspace,
  variant: EntryNode,
  componentsFolder: string,
): { file: FileToExport; entryPath: string; exportName: string } {
  const catalogId = getNodeCatalogId(variant, workspace) as ComponentId | null
  if (!catalogId) {
    throw new Error(
      `Node "${variant.id}" has no catalog component id — it cannot be exported.`,
    )
  }
  const schema = getComponentSchema(catalogId)
  const exportName = getComponentName(variant, workspace)
  const entryPath = `${componentsFolder}/${pluralizeLevel(schema.level)}/${exportName}.tsx`
  const file = files.get(entryPath)
  if (!file) {
    throw new Error(
      `Export produced no file at "${entryPath}" for variant "${variant.id}" ` +
        `(component "${catalogId}") — Factory may have failed to generate it silently.`,
    )
  }
  return { file, entryPath, exportName }
}

/**
 * Bundles and server-renders one generated component to HTML. `exportName`
 * is the export Factory gives both the file and the function (they always
 * match — see get-component-name.ts) — plain function components and
 * forwardRef/memo exotic components (objects, not functions) are both valid
 * `createElement` types, so no function-type check is done here.
 */
export async function bundleAndRender(
  files: ReadonlyMap<string, FileToExport>,
  entryPath: string,
  exportName: string,
): Promise<string> {
  const moduleExports = await loadComponent(files, entryPath)
  const component = moduleExports[exportName] as React.ComponentType | undefined
  if (!component) {
    throw new Error(
      `Bundled "${entryPath}" has no export named "${exportName}" ` +
        `(found: ${Object.keys(moduleExports).join(", ") || "none"}).`,
    )
  }
  return renderToStaticMarkup(React.createElement(component))
}
