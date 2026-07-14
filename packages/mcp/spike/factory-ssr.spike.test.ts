/**
 * Factory-SSR feasibility spike.
 *
 * `view_node` wants previews that ARE production output: run `exportWorkspace`
 * in-memory, bundle the generated React with esbuild against a virtual
 * filesystem (no disk writes), evaluate it in-process, and render with
 * `renderToStaticMarkup`. This spike proves that pipeline end to end for one
 * primitive (Text) and two composites (Button; ProductCard as a deeper tree).
 *
 * Go/no-go: if this suite passes, Factory-SSR stands and the bespoke
 * HTML-assembler fallback stays shelved. Findings are recorded in
 * spike/FINDINGS.md.
 */
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { exportWorkspace } from "@seldon/factory/export/export-workspace"
import type { FileToExport } from "@seldon/factory/export/types"
import esbuild from "esbuild"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import * as jsxRuntime from "react/jsx-runtime"
import { beforeAll, describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { workspaceReducer } from "@seldon/core/workspace/reducers/reducer"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, "../../..")

const COMPONENTS_FOLDER = "/components"

/** Node modules provided by the host process instead of the virtual bundle. */
const EXTERNAL_MODULES: Record<string, unknown> = {
  react: React,
  "react/jsx-runtime": jsxRuntime,
}

function buildSpikeWorkspace(): Workspace {
  let ws = createEmptyWorkspace()
  const dispatch = (action: WorkspaceAction) => {
    ws = workspaceReducer(ws, action)
  }
  // Text is a primitive; Button is a composite (icon + text children) and
  // pulls the icon/text boards in with it; ProductCard is a deeper composite.
  dispatch({ type: "add_component", payload: { boardKey: ComponentId.TEXT } })
  dispatch({ type: "add_component", payload: { boardKey: ComponentId.BUTTON } })
  dispatch({
    type: "add_component",
    payload: { boardKey: ComponentId.PRODUCT_CARD },
  })
  return ws
}

/** Resolves an import specifier against the in-memory export file map. */
function makeVirtualResolver(files: Map<string, FileToExport>) {
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

function virtualExportPlugin(files: Map<string, FileToExport>): esbuild.Plugin {
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
          return { contents: new Uint8Array(file.content), loader: "binary" }
        }
        if (args.path.endsWith(".css")) {
          return { contents: file.content, loader: "empty" }
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
  files: Map<string, FileToExport>,
  entryPath: string,
): Promise<Record<string, unknown>> {
  const result = await esbuild.build({
    entryPoints: [entryPath],
    bundle: true,
    write: false,
    format: "cjs",
    platform: "node",
    jsx: "automatic",
    logLevel: "silent",
    plugins: [virtualExportPlugin(files)],
  })
  const code = result.outputFiles[0]!.text
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

let files: Map<string, FileToExport>
let artifactsDir: string

const findEntry = (componentFileName: string): string => {
  for (const filePath of files.keys()) {
    if (filePath.endsWith(`/${componentFileName}`)) return filePath
  }
  throw new Error(`generated file ${componentFileName} not found in export`)
}

const cssText = (): string => {
  const css = files.get(`${COMPONENTS_FOLDER}/styles.css`)
  if (!css || typeof css.content !== "string") {
    throw new Error("styles.css missing from export")
  }
  return css.content
}

async function renderComponent(name: string): Promise<string> {
  const moduleExports = await loadComponent(files, findEntry(`${name}.tsx`))
  // Plain function components and forwardRef/memo exotic components (objects
  // carrying $$typeof) are both valid createElement types.
  const component = moduleExports[name] as React.ComponentType
  expect(component, `export "${name}"`).toBeDefined()
  const html = renderToStaticMarkup(React.createElement(component))
  // Keep a reviewable artifact per component: full document with inlined CSS.
  writeFileSync(
    path.join(artifactsDir, `${name}.html`),
    `<!doctype html><html><head><meta charset="utf-8"><style>${cssText()}</style></head><body>${html}</body></html>`,
  )
  return html
}

beforeAll(async () => {
  const workspace = buildSpikeWorkspace()
  const exported = await exportWorkspace(workspace, {
    rootDirectory: repoRoot,
    target: { framework: "react", styles: "css-properties" },
    output: {
      componentsFolder: COMPONENTS_FOLDER,
      assetsFolder: "/assets",
      assetPublicPath: "/assets",
    },
    skipFormat: true,
    exportAllIconSetIcons: false,
  })
  files = new Map(exported.map((file) => [file.path, file]))
  artifactsDir = mkdtempSync(path.join(tmpdir(), "seldon-ssr-spike-"))
  console.log(`Factory-SSR spike artifacts: ${artifactsDir}`)
})

describe("Factory-SSR pipeline (in-memory export → esbuild → renderToStaticMarkup)", () => {
  it("renders the Text primitive to HTML", async () => {
    const html = await renderComponent("Text")
    expect(html).not.toBe("")
    expect(html).toContain("sdn-text")
  })

  it("renders the Button composite to HTML including its children", async () => {
    const html = await renderComponent("Button")
    expect(html).toContain("sdn-button")
    // The default Button variant's icon child renders as an inlined SVG,
    // proving child composition survives the pipeline. (The text child
    // renders empty without props, so it leaves no marker to assert on.)
    expect(html).toMatch(/<svg/)
    expect(html).toContain("sdn-icon")
  })

  it("renders the ProductCard composite to HTML", async () => {
    const html = await renderComponent("ProductCard")
    expect(html).not.toBe("")
    expect(html.length).toBeGreaterThan(200)
  })

  it("exports component CSS usable for inlining", () => {
    expect(cssText()).toContain(".sdn-button")
    expect(cssText()).toContain(".sdn-text")
  })
})
