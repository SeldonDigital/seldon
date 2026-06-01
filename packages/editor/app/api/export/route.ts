import fs from "node:fs"
import path from "node:path"
import { NextRequest, NextResponse } from "next/server"
import type { Workspace } from "@seldon/core/workspace/types"
import { createNodeExportAssetReader } from "@seldon/factory/export/asset-reader"
import { exportWorkspace } from "@seldon/factory/export/export-workspace"
import type { ExportOptions, FileToExport } from "@seldon/factory/export/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type WireFile = {
  path: string
  encoding: "utf8" | "base64"
  content: string
}

/**
 * Walk up from the current working directory to find the monorepo root that
 * holds the `packages/core` source the factory reads icon and native-react
 * files from.
 */
function resolveRepoRoot(): string {
  let current = process.cwd()
  while (true) {
    if (fs.existsSync(path.join(current, "packages/core/icons/sets"))) {
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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      workspace: Workspace
      options?: Partial<ExportOptions>
    }

    if (!body?.workspace) {
      return NextResponse.json(
        { error: "Missing workspace in request body." },
        { status: 400 },
      )
    }

    const rootDirectory = resolveRepoRoot()

    const options: ExportOptions = {
      rootDirectory,
      target: { framework: "react", styles: "css-properties" },
      output: {
        componentsFolder: "components",
        assetsFolder: "assets",
        assetPublicPath: "/assets",
      },
      assetReader: createNodeExportAssetReader(rootDirectory),
      ...body.options,
    }

    const files = await exportWorkspace(body.workspace, options)

    return NextResponse.json({ files: files.map(toWireFile) })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Export failed." },
      { status: 500 },
    )
  }
}
