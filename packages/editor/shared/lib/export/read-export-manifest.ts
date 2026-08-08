import { EXPORT_MANIFEST_FILENAME, parseExportManifest } from "@seldon/factory/export/manifest"

import type { ExportManifest } from "@seldon/factory/export/manifest"
import type { FileToExport } from "@seldon/factory/export/types"

/**
 * Finds the manifest the export emitted in the file list. Returns its
 * output-root-relative path and parsed contents, so the caller can read the
 * matching file already on disk and compare ownership before writing.
 */
export function findEmittedManifest(
  files: FileToExport[],
): { path: string; manifest: ExportManifest } | null {
  const file = files.find((entry) => entry.path.split("/").pop() === EXPORT_MANIFEST_FILENAME)

  if (!file || typeof file.content !== "string") return null

  const manifest = parseExportManifest(file.content)

  return manifest ? { path: file.path, manifest } : null
}

/**
 * Reads a manifest already in the picked directory at `relativePath`. Returns
 * null when the folder holds no prior export, which reads as a fresh folder with
 * nothing to overwrite.
 */
export async function readExistingManifest(
  directory: FileSystemDirectoryHandle,
  relativePath: string,
): Promise<ExportManifest | null> {
  const segments = relativePath.split("/").filter((segment) => segment && segment !== ".")
  const fileName = segments.pop()

  if (!fileName) return null

  try {
    let current = directory

    for (const segment of segments) {
      current = await current.getDirectoryHandle(segment)
    }

    const handle = await current.getFileHandle(fileName)
    const file = await handle.getFile()

    return parseExportManifest(await file.text())
  } catch {
    return null
  }
}
