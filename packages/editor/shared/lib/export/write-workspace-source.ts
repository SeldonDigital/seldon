import { kebabCase } from "change-case"
import { orderWorkspaceNodeKeys } from "@seldon/core/workspace/helpers/nodes/order-entry-node-keys"

import type { Workspace } from "@seldon/core/workspace/types"

const SELDON_DIR = ".seldon"

/**
 * The source file name for a workspace and target, such as `my-app.react.json`.
 *
 * The workspace label is kebab-cased, and the framework is appended so a React
 * and a Vue export of the same workspace sit side by side without overwriting
 * each other. A label of punctuation alone kebab-cases to nothing, so the result
 * is checked and falls back to `workspace`.
 */
export function workspaceSourceFileName(workspace: Workspace, framework: string): string {
  const base = kebabCase(workspace.metadata.label ?? "") || "workspace"

  return `${base}.${framework}.json`
}

/**
 * Writes the editable design source to `.seldon/<label>.<framework>.json` at the
 * export root, the file `seldon-export --input` reads back.
 *
 * The Editor owns this file, so every export refreshes it and a later CLI or IDE
 * export regenerates the components from the latest design. The workspace is
 * ordered the same way a downloaded copy is, so the file stays stable across
 * re-exports and drops each node's redundant `id`; read it back through
 * `loadWorkspace`, which restores them.
 *
 * The previous source is kept as a single `<file>.bak` before the overwrite. One
 * prior version is recoverable, and the backup never grows beyond one file, so an
 * export cannot pile `.bak` copies into the project.
 */
export async function writeWorkspaceSource(
  root: FileSystemDirectoryHandle,
  workspace: Workspace,
  framework: string,
): Promise<void> {
  const dir = await root.getDirectoryHandle(SELDON_DIR, { create: true })
  const sourceFile = workspaceSourceFileName(workspace, framework)

  await backupExistingSource(dir, sourceFile)

  const content = `${JSON.stringify(orderWorkspaceNodeKeys(workspace), null, 2)}\n`
  const handle = await dir.getFileHandle(sourceFile, { create: true })
  const writable = await handle.createWritable()

  await writable.write(content)
  await writable.close()
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
    // No source yet, so there is nothing to back up.
    return
  }

  const backup = await dir.getFileHandle(`${sourceFile}.bak`, { create: true })
  const writable = await backup.createWritable()

  await writable.write(text)
  await writable.close()
}
