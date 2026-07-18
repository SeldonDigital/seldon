import type { Workspace } from "@seldon/core/workspace/types"

/**
 * Shared filesystem-backed workspace store.
 *
 * Both editors talk to the same `/api/workspaces` dev-server endpoint (served by
 * the workspace API Vite plugin over `<repoRoot>/.seldon/workspaces/`), so state
 * is shared across the React and Vue editors running on different ports. The
 * public API is unchanged; only the backing medium moved from IndexedDB to disk.
 * This editor stamps `lastEditor: "react"` for drift debugging, ignored on read.
 *
 * This is a dev-server capability. A static production build has no Node backend
 * and would need a real server; acceptable because these editors are local-only.
 */

export type StoredWorkspace = {
  id: string
  name: string
  workspace: Workspace
  updatedAt: string
  lastEditor?: "react" | "vue"
}

const BASE = "/api/workspaces"

export async function listStoredWorkspaces(): Promise<StoredWorkspace[]> {
  const response = await fetch(BASE)
  if (!response.ok) return []
  return (await response.json()) as StoredWorkspace[]
}

export async function getStoredWorkspace(
  id: string,
): Promise<StoredWorkspace | undefined> {
  const response = await fetch(`${BASE}/${encodeURIComponent(id)}`)
  if (!response.ok) return undefined
  return (await response.json()) as StoredWorkspace
}

export async function saveStoredWorkspace(
  record: StoredWorkspace,
): Promise<void> {
  const stamped: StoredWorkspace = { ...record, lastEditor: "react" }
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
    lastEditor: "react",
  }
  await saveStoredWorkspace(record)
  return record
}
