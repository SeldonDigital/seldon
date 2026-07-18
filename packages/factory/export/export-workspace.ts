import { Workspace } from "@seldon/core"

import { PLATFORMS } from "./platforms/registry"
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

  const platform = PLATFORMS[options.target.framework]
  if (!platform) {
    throw new Error(`Unknown export platform: ${options.target.framework}`)
  }
  if (!platform.export) {
    throw new Error(
      `Platform "${platform.label}" is planned but not available yet.`,
    )
  }

  return await platform.export(workspace, options)
}
