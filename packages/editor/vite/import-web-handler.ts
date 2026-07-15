import { runImportWeb } from "@seldon/factory/import/web"
import type { FileToExport } from "@seldon/factory/export/types"

export type WireFile = {
  path: string
  encoding: "utf8" | "base64"
  content: string
}

export type ImportWebRequestBody = {
  url: string
}

export type ImportWebResponse = {
  files: WireFile[]
  summary: {
    url: string
    rawNodeCount: number
    dedupedCount: number
    matchedCount: number
    unmatchedCount: number
    suggestions: string[]
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
 * Runs the factory web import against a URL and returns the wire-encoded files
 * the browser writes to the chosen folder, plus a run summary. Fetches and
 * parses the page with happy-dom, so it must run in a Node context.
 */
export async function runImportWebHandler(
  body: ImportWebRequestBody,
): Promise<ImportWebResponse> {
  const url = body?.url?.trim()
  if (!url) {
    throw new Error("Missing url in request body.")
  }
  if (!/^https?:\/\//i.test(url)) {
    throw new Error("Url must start with http:// or https://.")
  }

  const result = await runImportWeb(url)
  return {
    files: result.files.map(toWireFile),
    summary: result.summary,
  }
}
