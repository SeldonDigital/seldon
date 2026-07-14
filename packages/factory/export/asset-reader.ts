import fs from "node:fs"
import path from "node:path"

import type { IconId } from "@seldon/core/icon-sets"

export type IconExportSource = {
  relativePath: string
  content: string
}

export type ExportAssetReader = {
  readNativeComponent(fileStem: string): string | undefined
  readCustomComponent?(fileStem: string): string | undefined
  readIconFile(absolutePath: string): Buffer | undefined
  getIconExportSource?(iconId: IconId): IconExportSource | undefined
  listNativeComponentFileStems(): string[]
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
  return (
    resolved === resolvedRoot || resolved.startsWith(resolvedRoot + path.sep)
  )
}

export function createNodeExportAssetReader(
  rootDirectory: string,
): ExportAssetReader {
  const nativeReactPath = path.join(
    rootDirectory,
    "packages/core/components/native-react",
  )
  const customReactPath = path.join(
    rootDirectory,
    "packages/core/components/catalog/custom",
  )

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
  }
}
