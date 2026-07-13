import type { FileToExport } from "@seldon/factory/export/types"
import type { Workspace } from "@seldon/core/workspace/types"
import { logExport, logExportError } from "./log-export"

type WireFile = {
  path: string
  encoding: "utf8" | "base64"
  content: string
}

const EXPORT_REQUEST_TIMEOUT_MS = 60_000

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
 * Runs the factory export against the workspace via the local Next server route.
 * The route reads icon and native-react source from disk and formats the output,
 * then returns files the browser writes to the chosen folder.
 */
export async function runLocalExport(
  workspace: Workspace,
): Promise<FileToExport[]> {
  const startedAt = performance.now()
  const controller = new AbortController()
  const timeout = window.setTimeout(
    () => controller.abort(),
    EXPORT_REQUEST_TIMEOUT_MS,
  )
  logExport("POST /api/export", {
    boards: Object.keys(workspace.boards).length,
    nodes: Object.keys(workspace.nodes).length,
  })
  let response: Response
  try {
    response = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspace }),
      signal: controller.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Export timed out while generating files.")
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
  logExport(`API responded ${response.status}`, {
    ok: response.ok,
    elapsedMs: Math.round(performance.now() - startedAt),
  })

  if (!response.ok) {
    let message = "Export failed."
    try {
      const data = (await response.json()) as { error?: string }
      if (data?.error) message = data.error
    } catch {
      // Response was not JSON; keep the default message.
    }
    logExportError("API export failed", { status: response.status, message })
    throw new Error(message)
  }

  const data = (await response.json()) as { files: WireFile[] }
  logExport(`API returned ${data.files.length} file(s)`, {
    elapsedMs: Math.round(performance.now() - startedAt),
  })
  return data.files.map(fromWireFile)
}
