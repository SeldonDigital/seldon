/**
 * File System Access reader and writer for a project's workspace files.
 *
 * A bound project has three persisted forms under `.seldon`:
 * - Workspace sources, raw JSON files such as `dxf-website-<id>.react.json`.
 *   The editor, MCP, and CLI read and write this file.
 * - The workspace backup at `workspaces/<id>.json`, the wrapped store record.
 *   The editor writes it on every save so a copy remains if the source is lost.
 * - `project.json`, a manifest that maps each workspace id to its source.
 *
 * The DOM lib types the handle lookups but not `createWritable` on older targets
 * or async iteration, so those are widened at the call sites the way the folder
 * picker is elsewhere.
 */

import {
  createProjectManifest,
  loadWorkspace,
  readProjectManifest as parseProjectManifest,
  readLegacyProjectPointer,
  setProjectWorkspace,
} from "@seldon/core"
import { orderWorkspaceNodeKeys } from "@seldon/core/workspace/helpers/nodes/order-entry-node-keys"

import type { ProjectManifest } from "@seldon/core"
import type { Workspace } from "@seldon/core/workspace/types"

/** The on-disk record shape, matching the dev-server plugin and the MCP store. */
export interface ProjectWorkspaceRecord {
  id: string
  workspace: unknown
  updatedAt: string
  lastEditor?: string
  name?: string
}

/** A raw workspace source read from `.seldon/<name>.<platform>.json`. */
export interface ProjectSourceRead {
  fileName: string
  workspace: Workspace
  updatedAt: string
}

/** Store path below a project root, as `.seldon/workspaces`. */
const STORE_SEGMENTS = [".seldon", "workspaces"] as const

/** Folder that holds the workspace source and the project pointer. */
const SELDON_DIR = ".seldon"

/** Pointer file that names the live workspace source under `.seldon`. */
export const PROJECT_POINTER_FILE = "project.json"

type WritableFileHandle = FileSystemFileHandle & {
  createWritable: () => Promise<{
    write: (data: string) => Promise<void>
    close: () => Promise<void>
  }>
}

type IterableDirectoryHandle = FileSystemDirectoryHandle & {
  values: () => AsyncIterableIterator<FileSystemDirectoryHandle | FileSystemFileHandle>
}

/** Sanitizes an id into a file base, matching the server and MCP record path. */
function fileBase(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, "")
}

/** Resolves the store directory under a project root, creating it when asked. */
async function storeDirectory(
  root: FileSystemDirectoryHandle,
  create: boolean,
): Promise<FileSystemDirectoryHandle | null> {
  try {
    let directory = root

    for (const segment of STORE_SEGMENTS) {
      directory = await directory.getDirectoryHandle(segment, { create })
    }

    return directory
  } catch {
    return null
  }
}

/** Reads one record from a project store, or undefined when it is absent. */
export async function readProjectRecord(
  root: FileSystemDirectoryHandle,
  id: string,
): Promise<ProjectWorkspaceRecord | undefined> {
  const directory = await storeDirectory(root, false)

  if (!directory) return undefined

  try {
    const handle = await directory.getFileHandle(`${fileBase(id)}.json`)
    const text = await (await handle.getFile()).text()

    return JSON.parse(text) as ProjectWorkspaceRecord
  } catch {
    return undefined
  }
}

/** Writes one record into a project store, creating the store folders as needed. */
export async function writeProjectRecord(
  root: FileSystemDirectoryHandle,
  record: ProjectWorkspaceRecord,
): Promise<void> {
  const directory = await storeDirectory(root, true)

  if (!directory) {
    throw new Error("Could not open the project's .seldon/workspaces folder to write.")
  }

  const handle = (await directory.getFileHandle(`${fileBase(record.id)}.json`, {
    create: true,
  })) as WritableFileHandle
  const writable = await handle.createWritable()

  await writable.write(JSON.stringify(record, null, 2))
  await writable.close()
}

/** Removes one record from a project store. A missing file is not an error. */
export async function deleteProjectRecord(
  root: FileSystemDirectoryHandle,
  id: string,
): Promise<void> {
  const directory = await storeDirectory(root, false)

  if (!directory) return

  try {
    await directory.removeEntry(`${fileBase(id)}.json`)
  } catch {
    // Already gone, which is the normal case after a migrate.
  }
}

/** Lists every record in a project store, skipping unreadable or partial files. */
export async function listProjectRecords(
  root: FileSystemDirectoryHandle,
): Promise<ProjectWorkspaceRecord[]> {
  const directory = await storeDirectory(root, false)

  if (!directory) return []

  const records: ProjectWorkspaceRecord[] = []

  try {
    for await (const entry of (directory as IterableDirectoryHandle).values()) {
      if (entry.kind !== "file" || !entry.name.endsWith(".json")) continue

      try {
        const text = await (await (entry as FileSystemFileHandle).getFile()).text()

        records.push(JSON.parse(text) as ProjectWorkspaceRecord)
      } catch {
        // Skip a file that will not read or parse.
      }
    }
  } catch {
    // A store folder that will not open lists nothing.
  }

  return records
}

/** Resolves the `.seldon` folder under a project root, creating it when asked. */
async function seldonDirectory(
  root: FileSystemDirectoryHandle,
  create: boolean,
): Promise<FileSystemDirectoryHandle | null> {
  try {
    return await root.getDirectoryHandle(SELDON_DIR, { create })
  } catch {
    return null
  }
}

/** True when parsed JSON has the top-level maps a workspace file must carry. */
function isWorkspaceJson(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false

  const record = value as Record<string, unknown>

  return (
    typeof record.metadata === "object" &&
    record.metadata !== null &&
    typeof record.boards === "object" &&
    record.boards !== null &&
    typeof record.nodes === "object" &&
    record.nodes !== null
  )
}

/** Reads or migrates `.seldon/project.json` into the current manifest shape. */
export async function readProjectManifest(
  root: FileSystemDirectoryHandle,
): Promise<ProjectManifest | undefined> {
  const directory = await seldonDirectory(root, false)

  if (!directory) return undefined

  try {
    const handle = await directory.getFileHandle(PROJECT_POINTER_FILE)
    const text = await (await handle.getFile()).text()
    const parsed = JSON.parse(text) as unknown
    const manifest = parseProjectManifest(parsed)

    if (manifest) return manifest

    const legacy = readLegacyProjectPointer(parsed)

    if (!legacy) return undefined

    const source = await readProjectSource(root, legacy.workspace)

    if (!source?.workspace.metadata.id) return undefined

    const migrated = setProjectWorkspace(
      createProjectManifest(crypto.randomUUID()),
      source.workspace.metadata.id,
      {
        sourceFileName: legacy.workspace,
        updatedAt: source.updatedAt,
      },
    )

    await writePointerFile(directory, migrated, text)

    return migrated
  } catch {
    // No pointer yet, or the file is not a pointer.
  }

  return undefined
}

/** Registers a workspace source in `.seldon/project.json`. */
export async function writeProjectPointer(
  root: FileSystemDirectoryHandle,
  workspaceId: string,
  fileName: string,
  updatedAt: string,
): Promise<ProjectManifest> {
  const directory = await seldonDirectory(root, true)

  if (!directory) {
    throw new Error("Could not open the project's .seldon folder to write.")
  }

  const manifest = (await readProjectManifest(root)) ?? createProjectManifest(crypto.randomUUID())
  const next = setProjectWorkspace(manifest, workspaceId, {
    sourceFileName: fileName,
    updatedAt,
  })

  await writePointerFile(directory, next)

  return next
}

/**
 * Finds a workspace source under `.seldon`. A manifest entry always wins. A
 * preferred name is only used for a workspace that is not registered yet.
 */
export async function findProjectSourceFileName(
  root: FileSystemDirectoryHandle,
  workspaceId: string,
  preferred?: string,
): Promise<string | undefined> {
  const manifest = await readProjectManifest(root)
  const pointer = manifest?.workspaces[workspaceId]

  if (pointer) return pointer.sourceFileName

  const directory = await seldonDirectory(root, false)

  if (!directory) return undefined

  if (preferred) {
    try {
      await directory.getFileHandle(preferred)

      return preferred
    } catch {
      // The preferred name is not on disk yet.
    }
  }

  const names: string[] = []

  try {
    for await (const entry of (directory as IterableDirectoryHandle).values()) {
      if (entry.kind !== "file" || !entry.name.endsWith(".json")) continue
      if (entry.name === PROJECT_POINTER_FILE) continue

      try {
        const parsed: unknown = JSON.parse(
          await (await (entry as FileSystemFileHandle).getFile()).text(),
        )

        if (isWorkspaceJson(parsed)) names.push(entry.name)
      } catch {
        // Skip a file that will not read or parse as a workspace.
      }
    }
  } catch {
    return undefined
  }

  if (names.length === 1) return names[0]

  return undefined
}

async function writePointerFile(
  directory: FileSystemDirectoryHandle,
  manifest: ProjectManifest,
  previous?: string,
): Promise<void> {
  const handle = (await directory.getFileHandle(PROJECT_POINTER_FILE, {
    create: true,
  })) as WritableFileHandle
  const current = previous ?? (await readFileText(handle))

  if (current) {
    const backup = (await directory.getFileHandle(`${PROJECT_POINTER_FILE}.bak`, {
      create: true,
    })) as WritableFileHandle
    const writableBackup = await backup.createWritable()

    await writableBackup.write(current)
    await writableBackup.close()
  }

  const writable = await handle.createWritable()

  await writable.write(`${JSON.stringify(manifest, null, 2)}\n`)
  await writable.close()
}

async function readFileText(handle: FileSystemFileHandle): Promise<string | undefined> {
  try {
    return await (await handle.getFile()).text()
  } catch {
    return undefined
  }
}

/** Reads one workspace source, or undefined when it is absent or unreadable. */
export async function readProjectSource(
  root: FileSystemDirectoryHandle,
  fileName: string,
): Promise<ProjectSourceRead | undefined> {
  const directory = await seldonDirectory(root, false)

  if (!directory) return undefined

  try {
    const handle = await directory.getFileHandle(fileName)
    const file = await handle.getFile()
    const workspace = loadWorkspace(await file.text())

    return {
      fileName,
      workspace,
      updatedAt: new Date(file.lastModified).toISOString(),
    }
  } catch {
    return undefined
  }
}

/** Lists workspace sources registered in a project's manifest. */
export async function listProjectSources(
  root: FileSystemDirectoryHandle,
): Promise<Array<ProjectSourceRead & { projectId: string }>> {
  const manifest = await readProjectManifest(root)

  if (!manifest) return []

  const sources = await Promise.all(
    Object.values(manifest.workspaces).map(async (entry) =>
      readProjectSource(root, entry.sourceFileName),
    ),
  )

  return sources
    .filter((source): source is ProjectSourceRead => source !== undefined)
    .map((source) => ({ ...source, projectId: manifest.projectId }))
}

/**
 * Writes the raw workspace source and keeps one `.bak` of the prior file.
 * Returns the file name that was written.
 */
export async function writeProjectSource(
  root: FileSystemDirectoryHandle,
  fileName: string,
  workspace: Workspace,
): Promise<string> {
  const directory = await seldonDirectory(root, true)

  if (!directory) {
    throw new Error("Could not open the project's .seldon folder to write.")
  }

  await backupExistingSource(directory, fileName)

  const handle = (await directory.getFileHandle(fileName, { create: true })) as WritableFileHandle
  const writable = await handle.createWritable()
  const content = `${JSON.stringify(orderWorkspaceNodeKeys(workspace), null, 2)}\n`

  await writable.write(content)
  await writable.close()

  return fileName
}

/** Copies the current source to a single `.bak`, replacing any earlier backup. */
async function backupExistingSource(
  dir: FileSystemDirectoryHandle,
  sourceFile: string,
): Promise<void> {
  let text: string

  try {
    const existing = await dir.getFileHandle(sourceFile)
    const file = await existing.getFile()

    text = await file.text()
  } catch {
    return
  }

  const backup = (await dir.getFileHandle(`${sourceFile}.bak`, {
    create: true,
  })) as WritableFileHandle
  const writable = await backup.createWritable()

  await writable.write(text)
  await writable.close()
}
