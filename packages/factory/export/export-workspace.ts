import { Workspace } from "@seldon/core"

import { exportReact } from "./react/export-react"
import { ExportOptions, FileToExport } from "./types"

/**
 * Exports a workspace to a list of files that can then be written to disk, pushed to a git branch, etc.
 *
 * @param workspace - Workspace to export
 * @param opts - Options for the export
 * @returns A list of files to save or publish
 */

export async function exportWorkspace(
  workspace: Workspace,
  opts: ExportOptions,
): Promise<FileToExport[]> {
  // Use the provided folder paths directly without automatic seldon folder addition
  const assetReader =
    opts.assetReader ??
    (await import("./asset-reader")).createNodeExportAssetReader(
      opts.rootDirectory,
    )

  const options: ExportOptions = {
    assetReader,
    ...opts,
  }
  // Normalize paths to handle both inputs with and without trailing slashes
  options.output.componentsFolder = options.output.componentsFolder
    .replaceAll("//", "/")
    .replace(/\/$/, "") // Remove trailing slash
  options.output.assetsFolder = options.output.assetsFolder
    .replaceAll("//", "/")
    .replace(/\/$/, "") // Remove trailing slash

  if (options.target.framework === "react") {
    return await exportReact(workspace, options)
  }

  throw new Error(`Unsupported target.framework: ${options.target.framework}`)
}
