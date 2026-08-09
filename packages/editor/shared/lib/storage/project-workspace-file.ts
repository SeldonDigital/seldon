/**
 * File System Access reader and writer for a project's workspace store.
 *
 * A bound workspace lives at `<projectRoot>/.seldon/workspaces/<id>.json`, the
 * same one-file-per-workspace layout the editor's dev-server plugin and the MCP
 * server use. Writing the identical record shape here lets the editor and a
 * project's headless agent share one store through a folder handle the browser
 * holds, with no dev server in between.
 *
 * The DOM lib types the handle lookups but not `createWritable` on older targets
 * or async iteration, so those are widened at the call sites the way the folder
 * picker is elsewhere.
 */

/** The on-disk record shape, matching the dev-server plugin and the MCP store. */
export interface ProjectWorkspaceRecord {
  id: string
  workspace: unknown
  updatedAt: string
  lastEditor?: string
  name?: string
}

/** Store path below a project root, as `.seldon/workspaces`. */
const STORE_SEGMENTS = [".seldon", "workspaces"] as const

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
