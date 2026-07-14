/**
 * Per-workspace-version export cache for view_node/apply_actions' render.
 * `exportWorkspace`
 * always processes the whole workspace — there is no scoping option, and no
 * Core helper slices a minimal workspace (building one would need theme/node
 * reachability analysis Core doesn't expose). Rather than re-export on every
 * `view_node` call, cache the export keyed by the workspace object's own
 * identity, mirroring Core's own `getBoardByNodeId`
 * (@seldon/core/workspace/helpers/components/get-board-by-node-id): a
 * reducer always produces a new workspace reference on an accepted batch, so
 * caching by reference invalidates itself for free on every edit. Pay the
 * whole-export cost once per edit, not once per view.
 */
import { exportWorkspace } from "@seldon/factory/export/export-workspace"
import type { ExportOptions, FileToExport } from "@seldon/factory/export/types"

import type { Workspace } from "@seldon/core/workspace/types"

import { REPO_ROOT, assertFactorySourcesReachable } from "../repo-root"

export const COMPONENTS_FOLDER = "/components"
export const ASSETS_FOLDER = "/assets"

/** The one target every MCP-driven Factory run generates for. */
export const EXPORT_TARGET: ExportOptions["target"] = {
  framework: "react",
  styles: "css-properties",
}

/** Output layout shared by previews and workspace_export. */
export const EXPORT_OUTPUT: ExportOptions["output"] = {
  componentsFolder: COMPONENTS_FOLDER,
  assetsFolder: ASSETS_FOLDER,
  assetPublicPath: ASSETS_FOLDER,
}

/**
 * The canonical export options for internal previews. Not user-configurable
 * — `view_node`/`apply_actions`'s render param have no reason to vary these;
 * only `workspace_export`'s target directory is a user-facing choice.
 * `skipFormat` skips prettier formatting of source that's about to be
 * esbuild-bundled anyway (pure waste for a preview). `enableRemoteFonts`
 * emits `<link>` tags in the assembled HTML for faithfulness to production
 * output — this itself makes no server-side network call;
 * only the image/Playwright path needs to reconcile a browser
 * context actually fetching them.
 */
const VIEW_EXPORT_OPTIONS: ExportOptions = {
  rootDirectory: REPO_ROOT,
  target: EXPORT_TARGET,
  output: EXPORT_OUTPUT,
  skipFormat: true,
  exportAllIconSetIcons: false,
  enableRemoteFonts: true,
}

const exportCache = new WeakMap<object, Promise<FileToExport[]>>()

/**
 * Exports `workspace` once per distinct object identity, caching the
 * in-flight/completed promise so concurrent callers against the same
 * workspace version share one export.
 */
export function getCachedExport(workspace: Workspace): Promise<FileToExport[]> {
  let cached = exportCache.get(workspace)
  if (!cached) {
    assertFactorySourcesReachable()
    cached = exportWorkspace(workspace, VIEW_EXPORT_OPTIONS)
    // A rejected export must not poison the cache for the next call (e.g. a
    // transient failure) — only cache successful exports.
    cached.catch(() => exportCache.delete(workspace))
    exportCache.set(workspace, cached)
  }
  return cached
}

export function toFileMap(
  files: readonly FileToExport[],
): Map<string, FileToExport> {
  return new Map(files.map((file) => [file.path, file]))
}
