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
    classifiedCount: number
    suggestions: string[]
  }
}

/** Local Ollama host and model, matching the AI agent's defaults. */
const OLLAMA_HOST = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434"
const AI_MODEL = process.env.SELDON_AI_MODEL ?? "gpt-oss:20b"

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

  // Classification is on by default and best-effort: the pipeline falls back to
  // a heuristic description per piece when the local model is unreachable.
  const result = await runImportWeb(url, {
    classify: { model: AI_MODEL, host: OLLAMA_HOST },
  })
  return {
    files: result.files.map(toWireFile),
    summary: result.summary,
  }
}
