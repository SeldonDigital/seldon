import { Workspace } from "@seldon/core"

import { PLATFORMS } from "./platforms/registry"
import { ExportOptions, FileToExport } from "./types"

/**
 * Input to {@link exportWorkspace}. Asset paths are optional: when omitted they
 * default to nest under `componentsFolder` (`${componentsFolder}/assets` and
 * `/${componentsFolder}/assets`), so a generated library stays self-contained
 * and callers cannot accidentally emit a stray top-level `assets/` folder.
 */
export type ExportWorkspaceInput = Omit<ExportOptions, "output"> & {
  output: {
    componentsFolder: string
    assetsFolder?: string
    assetPublicPath?: string
  }
}

/**
 * Exports a workspace to a list of files that can then be written to disk, pushed to a git branch, etc.
 *
 * @param workspace - Workspace to export
 * @param opts - Options for the export
 * @returns A list of files to save or publish
 */

export async function exportWorkspace(
  workspace: Workspace,
  opts: ExportWorkspaceInput,
): Promise<FileToExport[]> {
  const assetReader =
    opts.assetReader ??
    (await import("./asset-reader")).createNodeExportAssetReader(
      opts.rootDirectory,
    )

  // Normalize the components folder first, then default the asset paths to
  // nest under it so the generated library is self-contained.
  const componentsFolder = opts.output.componentsFolder
    .replaceAll("//", "/")
    .replace(/\/$/, "")
  const assetsFolder = (opts.output.assetsFolder ?? `${componentsFolder}/assets`)
    .replaceAll("//", "/")
    .replace(/\/$/, "")
  const assetPublicPath = (
    opts.output.assetPublicPath ?? `/${componentsFolder}/assets`
  ).replaceAll("//", "/")

  const options: ExportOptions = {
    assetReader,
    ...opts,
    output: { componentsFolder, assetsFolder, assetPublicPath },
  }

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
