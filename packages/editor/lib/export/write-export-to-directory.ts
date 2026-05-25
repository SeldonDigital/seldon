import type { FileToExport } from "@seldon/factory/export/types"

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
): Promise<number> {
  let written = 0

  for (const file of files) {
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
  }

  return written
}

export async function pickExportDirectory(): Promise<FileSystemDirectoryHandle | null> {
  if (typeof window === "undefined" || !("showDirectoryPicker" in window)) {
    return null
  }
  return window.showDirectoryPicker({ mode: "readwrite" })
}
