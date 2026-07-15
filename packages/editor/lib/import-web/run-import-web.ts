import type { FileToExport } from "@seldon/factory/export/types"

type WireFile = {
  path: string
  encoding: "utf8" | "base64"
  content: string
}

export type ImportWebSummary = {
  url: string
  rawNodeCount: number
  dedupedCount: number
  matchedCount: number
  unmatchedCount: number
  suggestions: string[]
}

export type ImportWebResult = {
  files: FileToExport[]
  summary: ImportWebSummary
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function fromWireFile(file: WireFile): FileToExport {
  if (file.encoding === "utf8") {
    return { path: file.path, content: file.content }
  }
  return {
    path: file.path,
    content: base64ToBytes(file.content).buffer as ArrayBuffer,
  }
}

/**
 * Runs the factory web import against a URL via the local dev server route. The
 * route fetches and parses the page, deconstructs and dedupes its DOM, matches
 * against the catalog, and returns the report and draft schema files the browser
 * writes to the chosen folder.
 */
export async function runImportWeb(url: string): Promise<ImportWebResult> {
  const response = await fetch("/api/import-web", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    let message = "Import failed."
    try {
      const data = (await response.json()) as { error?: string }
      if (data?.error) message = data.error
    } catch {
      // Response was not JSON; keep the default message.
    }
    throw new Error(message)
  }

  const data = (await response.json()) as {
    files: WireFile[]
    summary: ImportWebSummary
  }
  return {
    files: data.files.map(fromWireFile),
    summary: data.summary,
  }
}
