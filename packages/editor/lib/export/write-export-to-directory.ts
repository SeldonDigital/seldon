import type { FileToExport } from "@seldon/factory/export/types"
import { logExport, logExportError } from "./log-export"

interface WriteProgress {
  currentPath: string
  total: number
  written: number
}

interface WriteExportOptions {
  onProgress?: (progress: WriteProgress) => void
}

async function ensureDirectory(
  parent: FileSystemDirectoryHandle,
  relativePath: string,
): Promise<FileSystemDirectoryHandle> {
  const parts = relativePath.split("/").filter(Boolean)
  let current = parent
  for (const part of parts) {
    current = await current.getDirectoryHandle(part, { create: true })
  }
  return current
}

export async function writeExportToDirectory(
  directory: FileSystemDirectoryHandle,
  files: FileToExport[],
  options: WriteExportOptions = {},
): Promise<number> {
  const startedAt = performance.now()
  let written = 0
  let lastProgressAt = 0
  logExport(`Writing ${files.length} file(s)`, { directory: directory.name })

  for (const file of files) {
    try {
      const normalized = file.path.replace(/\\/g, "/").replace(/^\/+/, "")
      const segments = normalized.split("/")
      const fileName = segments.pop()
      if (!fileName) continue

      const dir =
        segments.length > 0
          ? await ensureDirectory(directory, segments.join("/"))
          : directory

      const handle = await dir.getFileHandle(fileName, { create: true })
      const writable = await handle.createWritable()
      if (typeof file.content === "string") {
        await writable.write(file.content)
      } else {
        await writable.write(file.content)
      }
      await writable.close()
      written += 1
      const now = performance.now()
      if (written === files.length || now - lastProgressAt > 250) {
        options.onProgress?.({
          currentPath: normalized,
          total: files.length,
          written,
        })
        lastProgressAt = now
      }
    } catch (error) {
      logExportError("File write failed", { path: file.path, error })
      throw error
    }
  }

  logExport(`Finished writing ${written} file(s)`, {
    directory: directory.name,
    elapsedMs: Math.round(performance.now() - startedAt),
  })
  return written
}

export async function pickExportDirectory(): Promise<FileSystemDirectoryHandle | null> {
  if (typeof window === "undefined" || !("showDirectoryPicker" in window)) {
    return null
  }
  const showDirectoryPicker = (
    window as Window & {
      showDirectoryPicker: (options?: {
        mode?: "read" | "readwrite"
      }) => Promise<FileSystemDirectoryHandle>
    }
  ).showDirectoryPicker
  return showDirectoryPicker({ mode: "readwrite" })
}
