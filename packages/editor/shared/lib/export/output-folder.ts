import type { FileToExport } from "@seldon/factory/export/types"

/**
 * Normalizes a project-relative output folder. Empty means the project root.
 * Rejects a path that climbs out of the root, so a typed value cannot write
 * outside the folder the user picked.
 */
export function normalizeOutputFolder(value: string | undefined): string {
  if (!value) return ""

  const segments = value
    .replaceAll("\\", "/")
    .split("/")
    .filter((segment) => segment && segment !== ".")

  if (segments.some((segment) => segment === "..")) return ""

  return segments.join("/")
}

/**
 * Joins an output folder and a layout folder into one project-relative path.
 * `decks` plus `sdn` becomes `decks/sdn`. An empty output folder returns the
 * layout folder unchanged.
 */
export function joinExportPath(outputFolder: string | undefined, componentsFolder: string): string {
  const prefix = normalizeOutputFolder(outputFolder)
  const folder = componentsFolder.replaceAll("\\", "/").replace(/^\/+|\/+$/g, "")

  if (!prefix) return folder
  if (!folder) return prefix

  return `${prefix}/${folder}`
}

/**
 * Nests each export file under the output folder. The workspace source and the
 * store stay at the project root. An empty folder leaves the paths unchanged.
 */
export function prefixExportPaths(
  files: FileToExport[],
  outputFolder: string | undefined,
): FileToExport[] {
  const prefix = normalizeOutputFolder(outputFolder)

  if (!prefix) return files

  return files.map((file) => ({
    ...file,
    path: `${prefix}/${file.path.replace(/^\/+/, "")}`,
  }))
}
