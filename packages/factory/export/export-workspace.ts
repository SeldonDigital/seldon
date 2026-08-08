import { EXPORT_MANIFEST_FILENAME, buildExportManifest } from "./manifest"
import { PLATFORMS } from "./platforms/registry"
import { formatJson } from "./shared/format-json"
import { generateWorkspaceCopy } from "./shared/generate-workspace-copy"

import type { ExportOptions, FileToExport } from "./types"
import type { Workspace } from "@seldon/core"

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
    (await import("./asset-reader")).createNodeExportAssetReader(opts.rootDirectory)

  // Normalize the components folder first, then default the asset paths to
  // nest under it so the generated library is self-contained.
  const componentsFolder = opts.output.componentsFolder.replaceAll("//", "/").replace(/\/$/, "")
  const assetsFolder = (opts.output.assetsFolder ?? `${componentsFolder}/assets`)
    .replaceAll("//", "/")
    .replace(/\/$/, "")
  const assetPublicPath = (opts.output.assetPublicPath ?? `/${componentsFolder}/assets`).replaceAll(
    "//",
    "/",
  )

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
    throw new Error(`Platform "${platform.label}" is planned but not available yet.`)
  }

  const files = await platform.export(workspace, options)

  // Emitted here rather than inside a target so the copy holds the workspace as
  // authored. Each target rewrites image paths on its own copy, and the React
  // target adds a license header to every string file it emits, which would make
  // the JSON unparseable.
  if (options.includeWorkspace) {
    files.push(await generateWorkspaceCopy(workspace, options))
  }

  // Also emitted here, for the same reason and one more: the integrity hashes
  // must cover the bytes that reach disk, so the scripts carry their own license
  // and format pass and are hashed only once that is done.
  if (options.includeScripts) {
    const { generateScripts } = await import("./shared/generate-scripts")
    const { generateScriptsIntegrity } = await import("./shared/generate-scripts-integrity")
    const { generateRules } = await import("./shared/generate-rules")

    const scripts = await generateScripts(options)

    if (scripts.length > 0) {
      files.push(...scripts, await generateScriptsIntegrity(scripts, options))
    }

    // Rules ship with the scripts export. They are docs the user copies and
    // edits, so they stay out of the scripts integrity hashes.
    files.push(...generateRules(options))
  }

  // Emitted last so it records every other file. It marks which workspace owns
  // this components folder, so a later export into the same folder can warn
  // before overwriting another workspace's output. Skipped when the workspace
  // has no id, since ownership cannot be attributed without one.
  const workspaceId = workspace.metadata.id

  if (workspaceId) {
    const manifest = buildExportManifest(workspaceId, files)

    files.push({
      path: `${componentsFolder}/${EXPORT_MANIFEST_FILENAME}`.replaceAll("//", "/"),
      content: await formatJson(JSON.stringify(manifest, null, 2)),
    })
  }

  return files
}
