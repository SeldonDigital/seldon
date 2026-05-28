import type { Workspace } from "@seldon/core/workspace/types"
import type { FileToExport } from "@seldon/factory/export/types"

/**
 * Browser-local export is not wired yet. Factory export still depends on Node fs/path
 * in several modules. Use JSON export from the menu until this path is browser-safe.
 */
export async function runLocalExport(_workspace: Workspace): Promise<FileToExport[]> {
  throw new Error(
    "Folder export is not available in the local editor yet. Use Export workspace JSON instead.",
  )
}
