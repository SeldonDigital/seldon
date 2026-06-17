import { createNodeExportAssetReader } from "@seldon/factory/export/asset-reader"
import { exportWorkspace } from "@seldon/factory/export/export-workspace"
import type { ExportOptions, FileToExport } from "@seldon/factory/export/types"
import fs from "node:fs"
import path from "node:path"
import type { Workspace } from "@seldon/core/workspace/types"

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
 * Walk up from the current working directory to find the monorepo root that
 * holds the `packages/core` source the factory reads icon and native-react
 * files from.
 */
function resolveRepoRoot(): string {
  let current = process.cwd()
  while (true) {
    if (fs.existsSync(path.join(current, "packages/core/icon-sets/catalog"))) {
      return current
    }
    const parent = path.dirname(current)
    if (parent === current) {
      throw new Error(
        "Unable to locate repository root containing packages/core.",
      )
    }
    current = parent
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
): Promise<{ files: WireFile[] }> {
  if (!body?.workspace) {
    throw new Error("Missing workspace in request body.")
  }

  const rootDirectory = resolveRepoRoot()

  const options: ExportOptions = {
    rootDirectory,
    target: { framework: "react", styles: "css-properties" },
    output: {
      componentsFolder: "seldon",
      assetsFolder: "assets",
      assetPublicPath: "/assets",
    },
    assetReader: createNodeExportAssetReader(rootDirectory),
    // Default off so exports stay request-free. Flip to true (or override via
    // body.options once the export options UI exists) to emit Google font links.
    enableRemoteFonts: false,
    ...body.options,
  }

  const files = await exportWorkspace(body.workspace, options)

  return { files: files.map(toWireFile) }
}
