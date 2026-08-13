import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { createNodeExportAssetReader } from "@seldon/factory/export/asset-reader"
import { exportWorkspace } from "@seldon/factory/export/export-workspace"
import { createResolvedExportAssetReader } from "@seldon/factory/export/resolved-asset-reader"
import { loadWorkspace } from "@seldon/core/workspace/reducers/load-workspace"
import { DEFAULT_COMPONENTS_FOLDER } from "../lib/export/constants"

import type { Workspace } from "@seldon/core/workspace/types"
import type { ExportAssetReader } from "@seldon/factory/export/asset-reader"
import type { ExportOptions, FileToExport } from "@seldon/factory/export/types"

// Re-exported so the `export-seldon` scripts, which bundle this module to reach
// `runExport`, can read a workspace file through Core instead of `JSON.parse`.
export { loadWorkspace }

export type WireFile = {
  path: string
  encoding: "utf8" | "base64"
  content: string
}

export type ExportRequestBody = {
  workspace: Workspace
  options?: Partial<ExportOptions>
}

/**
 * Server-side context the dev server injects, never the browser. `root` is the
 * project the editor is mounted in, used to resolve the installed `@seldon/core`
 * when the export does not run from the monorepo source tree.
 */
export type RunExportServerConfig = {
  root?: string
}

/**
 * Walk up from the working directory to the monorepo root that holds the
 * `packages/core` source the factory reads icon and native-react files from.
 * Returns null off the monorepo, where the export reads from installed packages
 * instead.
 */
function findMonorepoRoot(start: string): string | null {
  let current = start

  while (true) {
    if (fs.existsSync(path.join(current, "packages/core/icon-sets/catalog"))) {
      return current
    }

    const parent = path.dirname(current)

    if (parent === current) {
      return null
    }

    current = parent
  }
}

/**
 * Picks how to read engine assets. In the monorepo the reader points at the
 * live `packages/core` source, so uncommitted schema and icon edits export. Off
 * the monorepo it resolves the installed `@seldon/core`, so a mounted editor in
 * a consumer project exports without a checkout. Returns the reader and the root
 * the factory bases relative asset paths on.
 */
function resolveAssetReader(root: string): {
  rootDirectory: string
  assetReader: ExportAssetReader
} {
  const monorepoRoot = findMonorepoRoot(root)

  if (monorepoRoot) {
    return {
      rootDirectory: monorepoRoot,
      assetReader: createNodeExportAssetReader(monorepoRoot),
    }
  }

  return {
    rootDirectory: root,
    assetReader: createResolvedExportAssetReader(pathToFileURL(path.join(root, "index.js")).href),
  }
}

function toWireFile(file: FileToExport): WireFile {
  if (typeof file.content === "string") {
    return { path: file.path, encoding: "utf8", content: file.content }
  }

  return {
    path: file.path,
    encoding: "base64",
    content: Buffer.from(file.content).toString("base64"),
  }
}

/**
 * Runs the factory export against a workspace and returns the wire-encoded
 * files the browser writes to the chosen folder. Reads icon and native-react
 * source from disk, so it must run in a Node context.
 */
export async function runExport(
  body: ExportRequestBody,
  serverConfig?: RunExportServerConfig,
): Promise<{ files: WireFile[] }> {
  if (!body?.workspace) {
    throw new Error("Missing workspace in request body.")
  }

  const root = path.resolve(serverConfig?.root ?? process.cwd())
  const { rootDirectory, assetReader } = resolveAssetReader(root)

  const options: ExportOptions = {
    rootDirectory,
    // Resolve the destination project's Prettier config so generated files land
    // formatted the way that project formats its own source.
    formatConfigRoot: root,
    target: { framework: "react", styles: "css-properties" },
    output: {
      componentsFolder: DEFAULT_COMPONENTS_FOLDER,
      // Images write to the project's `public/` and are referenced from the site
      // root, the static-asset convention shared by Vite and Next.js.
      assetsFolder: "public",
      assetPublicPath: "/",
    },
    assetReader,
    // Default off so exports stay request-free. Flip to true (or override via
    // body.options once the export options UI exists) to emit Google font links.
    enableRemoteFonts: false,
    // Default on so the export ships every icon enabled in the workspace's icon
    // sets. Override via body.options to tree-shake to only icons components use.
    exportAllIconSetIcons: true,
    ...body.options,
  }

  const files = await exportWorkspace(body.workspace, options)

  return { files: files.map(toWireFile) }
}
