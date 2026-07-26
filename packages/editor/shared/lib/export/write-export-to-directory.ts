import type { FileToExport } from "@seldon/factory/export/types"

// The browser File System Access layer is the export bottleneck: each file needs
// an async handle, writable stream, write, and close. Writing files in parallel
// is far faster than a sequential loop, and a cap keeps the browser from
// exhausting file handles on a large tree.
const WRITE_CONCURRENCY = 12

type ParsedFile = {
  dirPath: string
  fileName: string
  content: string | ArrayBuffer
}

function parseFile(file: FileToExport): ParsedFile | null {
  const normalized = file.path.replace(/\\/g, "/").replace(/^\/+/, "")
  // Drop empty, "." and ".." segments so a server-supplied path can never
  // escape the user-picked directory, rather than relying on the File System
  // Access API to reject those names.
  const segments = normalized
    .split("/")
    .filter((segment) => segment && segment !== "." && segment !== "..")
  const fileName = segments.pop()
  if (!fileName) return null
  return { dirPath: segments.join("/"), fileName, content: file.content }
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

/**
 * Creates every directory the export needs up front, shallowest first so each
 * parent exists before its children. Doing this sequentially before any file
 * write avoids the race where parallel writers create the same directory at
 * once, and lets the write phase reuse memoized handles.
 */
async function resolveDirectories(
  root: FileSystemDirectoryHandle,
  dirPaths: Set<string>,
): Promise<Map<string, FileSystemDirectoryHandle>> {
  const handles = new Map<string, FileSystemDirectoryHandle>([["", root]])
  const ordered = [...dirPaths].sort(
    (a, b) => a.split("/").length - b.split("/").length,
  )
  for (const dirPath of ordered) {
    if (handles.has(dirPath)) continue
    handles.set(dirPath, await ensureDirectory(root, dirPath))
  }
  return handles
}

async function writeFile(
  dir: FileSystemDirectoryHandle,
  fileName: string,
  content: string | ArrayBuffer,
): Promise<void> {
  const handle = await dir.getFileHandle(fileName, { create: true })
  const writable = await handle.createWritable()
  await writable.write(content)
  await writable.close()
}

export async function writeExportToDirectory(
  directory: FileSystemDirectoryHandle,
  files: FileToExport[],
): Promise<number> {
  const parsed = files
    .map(parseFile)
    .filter((file): file is ParsedFile => file !== null)

  const dirHandles = await resolveDirectories(
    directory,
    new Set(parsed.map((file) => file.dirPath)),
  )

  let written = 0
  let cursor = 0

  async function worker(): Promise<void> {
    while (cursor < parsed.length) {
      const file = parsed[cursor]
      cursor += 1
      if (!file) continue
      const dir = dirHandles.get(file.dirPath) ?? directory
      await writeFile(dir, file.fileName, file.content)
      written += 1
    }
  }

  const workerCount = Math.min(WRITE_CONCURRENCY, parsed.length)
  await Promise.all(Array.from({ length: workerCount }, () => worker()))

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
