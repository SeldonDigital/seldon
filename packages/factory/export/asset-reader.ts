import fs from "node:fs"
import path from "node:path"

import type { ResolvedIconExport } from "./react/utils/find-icon-path"
import type { IconId } from "@seldon/core/icon-sets"

export type IconExportSource = {
  relativePath: string
  content: string
}

export type ExportAssetReader = {
  readNativeComponent(fileStem: string): string | undefined
  readIconFile(absolutePath: string): Buffer | undefined
  listNativeComponentFileStems(): string[]
  readCustomComponent?(fileStem: string): string | undefined
  getIconExportSource?(iconId: IconId): IconExportSource | undefined
  /**
   * Resolves an icon id to its export metadata (component name and path relative
   * to the icons output folder). The icon index uses this so its export lines
   * match the files {@link getIconExportSource} emits. A host without the catalog
   * omits it, and the index falls back to the monorepo resolver.
   */
  resolveIconExport?(iconId: IconId): ResolvedIconExport | undefined
  /**
   * Every bindings library source, as a path relative to the bindings folder
   * using `/`. A host that cannot reach the factory sources omits this, and the
   * export emits no scripts.
   */
  listBindingsSources?(): string[]
  readBindingsSource?(relativePath: string): string | undefined
}

/**
 * A file stem must name a single file, never a path. Reject separators and `..`
 * so a stem cannot traverse out of its base directory when joined.
 */
function isSafeFileStem(fileStem: string): boolean {
  return !/[\\/]/.test(fileStem) && !fileStem.includes("..")
}

/** True when `candidate` resolves to `root` itself or a path inside it. */
function isInside(root: string, candidate: string): boolean {
  const resolvedRoot = path.resolve(root)
  const resolved = path.resolve(candidate)

  return resolved === resolvedRoot || resolved.startsWith(resolvedRoot + path.sep)
}

export function createNodeExportAssetReader(rootDirectory: string): ExportAssetReader {
  const nativeReactPath = path.join(rootDirectory, "packages/core/components/native-react")
  const customReactPath = path.join(rootDirectory, "packages/core/components/catalog/custom")
  const bindingsPath = path.join(rootDirectory, "packages/factory/bindings")

  return {
    readNativeComponent(fileStem: string): string | undefined {
      if (!isSafeFileStem(fileStem) || !fs.existsSync(nativeReactPath)) {
        return undefined
      }

      const filePath = path.join(nativeReactPath, `${fileStem}.tsx`)

      if (!fs.existsSync(filePath)) {
        return undefined
      }

      return fs.readFileSync(filePath, "utf8")
    },
    readCustomComponent(fileStem: string): string | undefined {
      if (!isSafeFileStem(fileStem) || !fs.existsSync(customReactPath)) {
        return undefined
      }

      const filePath = path.join(customReactPath, `${fileStem}.tsx`)

      if (!fs.existsSync(filePath)) {
        return undefined
      }

      return fs.readFileSync(filePath, "utf8")
    },
    readIconFile(absolutePath: string): Buffer | undefined {
      // Only read files inside the repo root. The path is derived from the
      // workspace, so containment stops a crafted workspace from reading and
      // embedding arbitrary files from disk.
      if (!isInside(rootDirectory, absolutePath) || !fs.existsSync(absolutePath)) {
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

      // The path comes from `listBindingsSources`, but containment is checked
      // anyway so a caller-supplied path cannot read outside the folder.
      if (!isInside(bindingsPath, filePath) || !fs.existsSync(filePath)) {
        return undefined
      }

      return fs.readFileSync(filePath, "utf8")
    },
  }
}
