import fs from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"

import {
  getIconSourcePathInCatalog,
  resolveIconExportInCatalog,
} from "./react/utils/find-icon-path"

import type { ExportAssetReader, IconExportSource } from "./asset-reader"
import type { ResolvedIconExport } from "./react/utils/find-icon-path"
import type { IconId } from "@seldon/core/icon-sets"

/**
 * Builds an {@link ExportAssetReader} that resolves engine source from the
 * installed `@seldon/core` and `@seldon/factory` packages instead of a monorepo
 * layout. Use this when the export runs from a consumer project, such as the
 * `seldon-export` CLI, where there is no `packages/core` on disk.
 *
 * The in-repo reader (`createNodeExportAssetReader`) stays the path for the
 * editor and the repo's own regen, which do have the monorepo tree.
 */
export function createResolvedExportAssetReader(fromUrl?: string): ExportAssetReader {
  const requireFrom = createRequire(fromUrl ?? import.meta.url)
  const coreRoot = resolvePackageDir("@seldon/core", requireFrom)
  const factoryRoot = resolvePackageDir("@seldon/factory", requireFrom)

  const nativeReactPath = path.join(coreRoot, "components/native-react")
  const customReactPath = path.join(coreRoot, "components/catalog/custom")
  const iconCatalogPath = path.join(coreRoot, "icon-sets/catalog")
  const bindingsPath = path.join(factoryRoot, "bindings")

  return {
    readNativeComponent(fileStem: string): string | undefined {
      return readComponentFile(nativeReactPath, fileStem)
    },
    readCustomComponent(fileStem: string): string | undefined {
      return readComponentFile(customReactPath, fileStem)
    },
    readIconFile(absolutePath: string): Buffer | undefined {
      // Containment against the installed core keeps a crafted workspace from
      // reading files outside the package, matching the in-repo reader.
      if (!isInside(coreRoot, absolutePath) || !fs.existsSync(absolutePath)) {
        return undefined
      }

      return fs.readFileSync(absolutePath)
    },
    listNativeComponentFileStems(): string[] {
      if (!fs.existsSync(nativeReactPath)) {
        return []
      }

      return fs
        .readdirSync(nativeReactPath)
        .filter((name) => name.endsWith(".tsx"))
        .map((name) => name.replace(/\.tsx$/, ""))
    },
    getIconExportSource(iconId: IconId): IconExportSource | undefined {
      // `__default__` is generated inline by the export, so it is left to that
      // path rather than resolved from the catalog.
      if (iconId === "__default__") {
        return undefined
      }

      const resolved = resolveIconExportInCatalog(iconId, iconCatalogPath)

      if (!resolved) {
        return undefined
      }

      const sourcePath = getIconSourcePathInCatalog(resolved, iconCatalogPath)

      if (!fs.existsSync(sourcePath)) {
        return undefined
      }

      return {
        relativePath: resolved.relativePath,
        content: fs.readFileSync(sourcePath, "utf8"),
      }
    },
    resolveIconExport(iconId: IconId): ResolvedIconExport | undefined {
      return resolveIconExportInCatalog(iconId, iconCatalogPath) ?? undefined
    },
    listBindingsSources(): string[] {
      if (!fs.existsSync(bindingsPath)) {
        return []
      }

      const sources: string[] = []

      function walk(relative: string): void {
        const entries = fs.readdirSync(path.join(bindingsPath, relative), { withFileTypes: true })

        for (const entry of entries) {
          const next = relative ? `${relative}/${entry.name}` : entry.name

          if (entry.isDirectory()) {
            walk(next)
          } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) {
            sources.push(next)
          }
        }
      }

      walk("")

      return sources.sort()
    },
    readBindingsSource(relativePath: string): string | undefined {
      const filePath = path.join(bindingsPath, relativePath)

      if (!isInside(bindingsPath, filePath) || !fs.existsSync(filePath)) {
        return undefined
      }

      return fs.readFileSync(filePath, "utf8")
    },
  }
}

/** A file stem must name a single file, never a path, so it cannot traverse out. */
function isSafeFileStem(fileStem: string): boolean {
  return !/[\\/]/.test(fileStem) && !fileStem.includes("..")
}

/** True when `candidate` resolves to `root` itself or a path inside it. */
function isInside(root: string, candidate: string): boolean {
  const resolvedRoot = path.resolve(root)
  const resolved = path.resolve(candidate)

  return resolved === resolvedRoot || resolved.startsWith(resolvedRoot + path.sep)
}

function readComponentFile(baseDir: string, fileStem: string): string | undefined {
  if (!isSafeFileStem(fileStem) || !fs.existsSync(baseDir)) {
    return undefined
  }

  const filePath = path.join(baseDir, `${fileStem}.tsx`)

  if (!fs.existsSync(filePath)) {
    return undefined
  }

  return fs.readFileSync(filePath, "utf8")
}

/**
 * Locates a package's install directory. Tries `${spec}/package.json` first,
 * then falls back to resolving the package entry and walking up to the folder
 * whose `package.json` names the package. The fallback covers a package whose
 * `exports` map does not expose `./package.json`.
 */
function resolvePackageDir(spec: string, requireFrom: NodeRequire): string {
  try {
    return path.dirname(requireFrom.resolve(`${spec}/package.json`))
  } catch {
    // Fall through to the entry-walk below.
  }

  let dir = path.dirname(requireFrom.resolve(spec))

  while (true) {
    const manifest = path.join(dir, "package.json")

    if (fs.existsSync(manifest)) {
      try {
        const name = JSON.parse(fs.readFileSync(manifest, "utf8")).name

        if (name === spec) {
          return dir
        }
      } catch {
        // A malformed manifest is ignored; keep walking up.
      }
    }

    const parent = path.dirname(dir)

    if (parent === dir) {
      throw new Error(`Unable to locate the install directory for "${spec}".`)
    }

    dir = parent
  }
}
