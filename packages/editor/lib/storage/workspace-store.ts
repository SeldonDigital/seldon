import { createStore, del, get, set } from "idb-keyval"
import type { Workspace } from "@seldon/core/workspace/types"

const store = createStore("seldon-editor-local", "workspaces")

export type StoredWorkspace = {
  id: string
  name: string
  workspace: Workspace
  updatedAt: string
}

const listKey = "workspace-index"

async function readIndex(): Promise<string[]> {
  return (await get<string[]>(listKey, store)) ?? []
}

async function writeIndex(ids: string[]): Promise<void> {
  await set(listKey, ids, store)
}

function recordKey(id: string): string {
  return `workspace:${id}`
}

export async function listStoredWorkspaces(): Promise<StoredWorkspace[]> {
  const ids = await readIndex()
  const records = await Promise.all(
    ids.map((id) => get<StoredWorkspace>(recordKey(id), store)),
  )
  return records.filter((r): r is StoredWorkspace => r != null)
}

export async function getStoredWorkspace(
  id: string,
): Promise<StoredWorkspace | undefined> {
  return get<StoredWorkspace>(recordKey(id), store)
}

export async function saveStoredWorkspace(
  record: StoredWorkspace,
): Promise<void> {
  const ids = await readIndex()
  if (!ids.includes(record.id)) {
    await writeIndex([...ids, record.id])
  }
  await set(recordKey(record.id), record, store)
}

export async function deleteStoredWorkspace(id: string): Promise<void> {
  await del(recordKey(id), store)
  const ids = await readIndex()
  await writeIndex(ids.filter((entry) => entry !== id))
}

export async function createStoredWorkspace(
  name: string,
  workspace: Workspace,
): Promise<StoredWorkspace> {
  const id = crypto.randomUUID()
  const record: StoredWorkspace = {
    id,
    name,
    workspace,
    updatedAt: new Date().toISOString(),
  }
  await saveStoredWorkspace(record)
  return record
}
