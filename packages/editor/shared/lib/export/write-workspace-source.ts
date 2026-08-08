import { orderWorkspaceNodeKeys } from "@seldon/core/workspace/helpers/nodes/order-entry-node-keys"

import type { Workspace } from "@seldon/core/workspace/types"

const SELDON_DIR = ".seldon"
const SOURCE_FILE = "workspace.json"
const BACKUP_FILE = "workspace.json.bak"

/**
 * Writes the editable design source to `.seldon/workspace.json` at the export
 * root, the file `seldon-export --input .seldon/workspace.json` reads back.
 *
 * The Editor owns this file, so every export refreshes it and a later CLI or IDE
 * export regenerates the components from the latest design. The workspace is
 * ordered the same way a downloaded copy is, so the file stays stable across
 * re-exports and drops each node's redundant `id`; read it back through
 * `loadWorkspace`, which restores them.
 *
 * The previous source is kept as a single `.seldon/workspace.json.bak` before the
 * overwrite. One prior version is recoverable, and the backup never grows beyond
 * one file, so an export cannot pile `.bak` copies into the project.
 */
export async function writeWorkspaceSource(
  root: FileSystemDirectoryHandle,
  workspace: Workspace,
): Promise<void> {
  const dir = await root.getDirectoryHandle(SELDON_DIR, { create: true })

  await backupExistingSource(dir)

  const content = `${JSON.stringify(orderWorkspaceNodeKeys(workspace), null, 2)}\n`
  const handle = await dir.getFileHandle(SOURCE_FILE, { create: true })
  const writable = await handle.createWritable()

  await writable.write(content)
  await writable.close()
}

/** Copies the current source to a single `.bak`, replacing any earlier backup. */
async function backupExistingSource(dir: FileSystemDirectoryHandle): Promise<void> {
  let text: string

  try {
    const existing = await dir.getFileHandle(SOURCE_FILE)
    const file = await existing.getFile()

    text = await file.text()
  } catch {
    // No source yet, so there is nothing to back up.
    return
  }

  const backup = await dir.getFileHandle(BACKUP_FILE, { create: true })
  const writable = await backup.createWritable()

  await writable.write(text)
  await writable.close()
}
