import { orderWorkspaceNodeKeys } from "@seldon/core/workspace/helpers/nodes/order-entry-node-keys"
import { restoreWorkspaceNodeIds } from "@seldon/core/workspace/helpers/nodes/restore-entry-node-ids"
import { setWorkspaceLabel } from "@seldon/core/workspace/reducers/handlers/set/set-workspace-label"

import type { Workspace } from "@seldon/core/workspace/types"

/**
 * Shared filesystem-backed workspace store.
 *
 * Both editors talk to the same `/api/workspaces` dev-server endpoint (served by
 * the workspace API Vite plugin over `<repoRoot>/.seldon/workspaces/`), so state
 * is shared across the React and Vue editors running on different ports. The
 * public API is unchanged; only the backing medium moved from IndexedDB to disk.
 * Each app calls `configureWorkspaceStore` at startup to stamp `lastEditor`
 * ("react" or "vue") for drift debugging, ignored on read.
 *
 * This is a dev-server capability. A static production build has no Node backend
 * and would need a real server; acceptable because these editors are local-only.
 *
 * Records leaving this module always carry node `id` fields, and records written
 * through it always omit them. Stored JSON drops `id` because it repeats the key
 * each node sits under in `nodes`.
 *
 * A record holds no name of its own. The workspace name is `metadata.label` on
 * the workspace it wraps, so renaming is an ordinary workspace edit.
 */

export type EditorId = "react" | "vue"

export type StoredWorkspace = {
  id: string
  workspace: Workspace
  updatedAt: string
  lastEditor?: EditorId
}

/** A record as it may still sit on disk, before the name moved into the label. */
type StoredWorkspaceOnDisk = StoredWorkspace & { name?: string }

const BASE = "/api/workspaces"

/**
 * Which editor is writing. Each app calls `configureWorkspaceStore` once at
 * startup so saved records carry the correct `lastEditor` stamp for drift
 * debugging. Defaults to "react" so the React editor works without extra wiring.
 */
let currentEditor: EditorId = "react"

export function configureWorkspaceStore(editor: EditorId): void {
  currentEditor = editor
}

/**
 * Brings a record read from disk to the current shape. Node ids are restored,
 * and a record still carrying a top-level `name` seeds `metadata.label` when the
 * label is unset. The legacy field is dropped here, so the next save clears it
 * from disk.
 */
function readRecord(record: StoredWorkspaceOnDisk): StoredWorkspace {
  const { name, ...rest } = record
  const base = restoreWorkspaceNodeIds(rest.workspace)

  // Seed identity from the record key for a file written before metadata carried
  // an id, so a live record keeps its existing identity instead of minting a new
  // one when it next loads through Core.
  const withId = base.metadata.id
    ? base
    : { ...base, metadata: { ...base.metadata, id: rest.id } }

  const workspace =
    !withId.metadata.label && name ? setWorkspaceLabel({ value: name }, withId) : withId

  return { ...rest, workspace }
}

export async function listStoredWorkspaces(): Promise<StoredWorkspace[]> {
  const response = await fetch(BASE)

  if (!response.ok) return []
  const records = (await response.json()) as StoredWorkspaceOnDisk[]

  return records.map(readRecord)
}

export async function getStoredWorkspace(id: string): Promise<StoredWorkspace | undefined> {
  const response = await fetch(`${BASE}/${encodeURIComponent(id)}`)

  if (!response.ok) return undefined
  const record = (await response.json()) as StoredWorkspaceOnDisk

  return readRecord(record)
}

export async function saveStoredWorkspace(record: StoredWorkspace): Promise<void> {
  const workspace = orderWorkspaceNodeKeys(record.workspace)
  // The record key mirrors the workspace's own identity, so the file name and
  // metadata.id never drift. A record seeded on read already agrees, so this is
  // a no-op there and only realigns a record that arrived without one.
  const id = workspace.metadata.id ?? record.id

  const stamped: StoredWorkspace = {
    ...record,
    id,
    workspace,
    lastEditor: currentEditor,
  }

  await fetch(`${BASE}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stamped),
  })
}

export async function deleteStoredWorkspace(id: string): Promise<void> {
  await fetch(`${BASE}/${encodeURIComponent(id)}`, { method: "DELETE" })
}

/** Creates a record for a workspace. The name travels in `metadata.label`. */
export async function createStoredWorkspace(workspace: Workspace): Promise<StoredWorkspace> {
  // Reuse an incoming identity, such as an imported workspace, or mint one, then
  // stamp it into metadata so the workspace, the record key, and any exported
  // copy all resolve to the same id.
  const id = workspace.metadata.id ?? crypto.randomUUID()

  const record: StoredWorkspace = {
    id,
    workspace: { ...workspace, metadata: { ...workspace.metadata, id } },
    updatedAt: new Date().toISOString(),
    lastEditor: currentEditor,
  }

  await saveStoredWorkspace(record)

  return record
}
