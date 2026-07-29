import { orderWorkspaceNodeKeys } from "@seldon/core/workspace/helpers/nodes/order-entry-node-keys"
import { restoreWorkspaceNodeIds } from "@seldon/core/workspace/helpers/nodes/restore-entry-node-ids"

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
 */

export type EditorId = "react" | "vue"

export type StoredWorkspace = {
  id: string
  name: string
  workspace: Workspace
  updatedAt: string
  lastEditor?: EditorId
}

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

export async function listStoredWorkspaces(): Promise<StoredWorkspace[]> {
  const response = await fetch(BASE)

  if (!response.ok) return []
  const records = (await response.json()) as StoredWorkspace[]

  return records.map((record) => ({
    ...record,
    workspace: restoreWorkspaceNodeIds(record.workspace),
  }))
}

export async function getStoredWorkspace(id: string): Promise<StoredWorkspace | undefined> {
  const response = await fetch(`${BASE}/${encodeURIComponent(id)}`)

  if (!response.ok) return undefined
  const record = (await response.json()) as StoredWorkspace

  return { ...record, workspace: restoreWorkspaceNodeIds(record.workspace) }
}

export async function saveStoredWorkspace(record: StoredWorkspace): Promise<void> {
  const stamped: StoredWorkspace = {
    ...record,
    workspace: orderWorkspaceNodeKeys(record.workspace),
    lastEditor: currentEditor,
  }

  await fetch(`${BASE}/${encodeURIComponent(record.id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stamped),
  })
}

export async function deleteStoredWorkspace(id: string): Promise<void> {
  await fetch(`${BASE}/${encodeURIComponent(id)}`, { method: "DELETE" })
}

export async function createStoredWorkspace(
  name: string,
  workspace: Workspace,
): Promise<StoredWorkspace> {
  const record: StoredWorkspace = {
    id: crypto.randomUUID(),
    name,
    workspace,
    updatedAt: new Date().toISOString(),
    lastEditor: currentEditor,
  }

  await saveStoredWorkspace(record)

  return record
}
