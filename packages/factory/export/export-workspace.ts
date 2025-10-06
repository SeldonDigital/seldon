import { Workspace } from "@seldon/core"
import { SELDON_EXPORT_FOLDER } from "./constants"
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
  // Make sure we always export to a seldon folder
  const options: ExportOptions = {
    ...opts,
  }
  options.output.componentsFolder += `/${SELDON_EXPORT_FOLDER}`
  options.output.componentsFolder = options.output.componentsFolder.replaceAll(
    "//",
    "/",
  ) // To make the API more resilient to user input, make sure that we are handle both inputs with and without a trailing slash

  options.output.assetsFolder += `/${SELDON_EXPORT_FOLDER}`
  options.output.assetsFolder = options.output.assetsFolder.replaceAll(
    "//",
    "/",
  ) // To make the API more resilient to user input, make sure that we are handle both inputs with and without a trailing slash

  if (options.target.framework === "react") {
    return await exportReact(workspace, options)
  }

  throw new Error(`Unsupported target.framework: ${options.target.framework}`)
}
