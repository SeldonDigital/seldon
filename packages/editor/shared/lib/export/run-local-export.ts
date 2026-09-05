import type { Workspace } from "@seldon/core/workspace/types"
import type { ExportOptions, FileToExport } from "@seldon/factory/export/types"

/**
 * Editor-facing export options. Loosens `output` so a caller can pass only a
 * `componentsFolder` and let the factory default the asset folders, matching a
 * framework layout that ships no explicit asset paths (such as `none`).
 */
export type LocalExportOptions = Partial<Omit<ExportOptions, "output">> & {
  output?: Partial<ExportOptions["output"]>
  /**
   * Project-relative folder generated files nest under. The workspace source
   * and the store stay at the picked project root. Empty means the root.
   */
  outputFolder?: string
}

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
 * `options` overrides the server defaults: folders, remote fonts, hidden
 * components, icon, theme, and font scope, and whether to emit the workspace
 * copy and the scripts. Omitting it keeps the server defaults.
 */
export async function runLocalExport(
  workspace: Workspace,
  options?: LocalExportOptions,
): Promise<FileToExport[]> {
  const { outputFolder: _outputFolder, ...factoryOptions } = options ?? {}
  const response = await fetch("/api/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options ? { workspace, options: factoryOptions } : { workspace }),
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
