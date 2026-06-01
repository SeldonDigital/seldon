import type { FileToExport } from "@seldon/factory/export/types"

type SafeExportPath = {
  directories: string[]
  fileName: string
}

function normalizeExportPath(path: string): SafeExportPath | null {
  const normalized = path.replace(/\\/g, "/").replace(/^\/+/, "")
  const parts = normalized.split("/").filter(Boolean)

  if (parts.length === 0) {
    return null
  }

  for (const part of parts) {
    if (
      part === "." ||
      part === ".." ||
      part.includes("\0") ||
      part.includes(":")
    ) {
      throw new Error(`Unsafe export path "${path}"`)
    }
  }

  const fileName = parts.pop()
  if (!fileName) {
    return null
  }

  return { directories: parts, fileName }
}

async function ensureDirectory(
  parent: FileSystemDirectoryHandle,
  parts: string[],
): Promise<FileSystemDirectoryHandle> {
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
    const safePath = normalizeExportPath(file.path)
    if (!safePath) continue

    const dir =
      safePath.directories.length > 0
        ? await ensureDirectory(directory, safePath.directories)
        : directory

    const handle = await dir.getFileHandle(safePath.fileName, { create: true })
    const writable = await handle.createWritable()
    try {
      await writable.write(file.content)
    } finally {
      await writable.close()
    }
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
