import type { ExportOptions, FileToExport } from "@seldon/factory/export/types"
import type { Workspace } from "@seldon/core/workspace/types"

type WireFile = {
  path: string
  encoding: "utf8" | "base64"
  content: string
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
 * Runs the factory export against the workspace via the local Next server route.
 * The route reads icon and native-react source from disk and formats the output,
 * then returns files the browser writes to the chosen folder.
 *
 * `options` overrides the server defaults (folders, remote fonts, hidden
 * components, icon/theme/font scope). Omitting it keeps the current behavior.
 */
export async function runLocalExport(
  workspace: Workspace,
  options?: Partial<ExportOptions>,
): Promise<FileToExport[]> {
  const response = await fetch("/api/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options ? { workspace, options } : { workspace }),
  })

  if (!response.ok) {
    let message = "Export failed."
    try {
      const data = (await response.json()) as { error?: string }
      if (data?.error) message = data.error
    } catch {
      // Response was not JSON; keep the default message.
    }
    throw new Error(message)
  }

  const data = (await response.json()) as { files: WireFile[] }
  return data.files.map(fromWireFile)
}
