import fs from "node:fs"
import path from "node:path"

import type { IconId } from "@seldon/core/icon-sets"

export type IconExportSource = {
  relativePath: string
  content: string
}

export type ExportAssetReader = {
  readNativeComponent(fileStem: string): string | undefined
  readIconFile(absolutePath: string): Buffer | undefined
  getIconExportSource?(iconId: IconId): IconExportSource | undefined
  listNativeComponentFileStems(): string[]
}

export function createNodeExportAssetReader(
  rootDirectory: string,
): ExportAssetReader {
  const nativeReactPath = path.join(
    rootDirectory,
    "packages/core/components/native-react",
  )

  return {
    readNativeComponent(fileStem: string): string | undefined {
      if (!fs.existsSync(nativeReactPath)) {
        return undefined
      }
      const filePath = path.join(nativeReactPath, `${fileStem}.tsx`)
      if (!fs.existsSync(filePath)) {
        return undefined
      }
      return fs.readFileSync(filePath, "utf8")
    },
    readIconFile(absolutePath: string): Buffer | undefined {
      if (!fs.existsSync(absolutePath)) {
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
