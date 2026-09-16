import { createEmptyWorkspace } from "@seldon/core"
import { orderWorkspaceNodeKeys } from "@seldon/core/workspace/helpers/nodes/order-entry-node-keys"
import { restoreWorkspaceNodeIds } from "@seldon/core/workspace/helpers/nodes/restore-entry-node-ids"
import { setWorkspaceLabel } from "@seldon/core/workspace/reducers/handlers/set/set-workspace-label"
import { workspaceSourceFileName } from "../export/write-workspace-source"
import {
  deleteProjectRecord,
  findProjectSourceFileName,
  readProjectRecord,
  readProjectSource,
  writeProjectPointer,
  writeProjectRecord,
  writeProjectSource,
} from "./project-workspace-file"
import {
  deleteBinding,
  getActiveHandle,
  getBinding,
  listBindings,
  saveBinding,
  touchBinding,
} from "./workspace-binding-store"

import type { WorkspaceBindingEntry } from "./workspace-binding-store"
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
 *
 * A bound project reads and writes the workspace source under `.seldon` first.
 * The hashed `workspaces/<id>.json` record is still written as a backup.
 */

export type EditorId = "react" | "vue"

export type StoredWorkspace = {
  id: string
  workspace: Workspace
  updatedAt: string
  lastEditor?: EditorId
  /**
   * The project folder a bound workspace lives in, for the home label. Absent
   * for a workspace in the editor's live store. Display only, never persisted.
   */
  boundProject?: string
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
  const withId = base.metadata.id ? base : { ...base, metadata: { ...base.metadata, id: rest.id } }

  const workspace =
    !withId.metadata.label && name ? setWorkspaceLabel({ value: name }, withId) : withId

  return { ...rest, workspace }
}

/**
 * A bound workspace shown on the home list without opening its project folder.
 * The label and time come from the binding mirror, and the workspace body is a
 * stand-in the card only reads the label from. Opening it reads the real file.
 */
function boundListEntry(binding: WorkspaceBindingEntry): StoredWorkspace {
  const base = setWorkspaceLabel({ value: binding.label || binding.id }, createEmptyWorkspace())
  const workspace = { ...base, metadata: { ...base.metadata, id: binding.id } }

  return {
    id: binding.id,
    workspace,
    updatedAt: binding.updatedAt,
    boundProject: binding.projectName,
  }
}

export async function listStoredWorkspaces(): Promise<StoredWorkspace[]> {
  const response = await fetch(BASE)
  const live = response.ok
    ? ((await response.json()) as StoredWorkspaceOnDisk[]).map(readRecord)
    : []

  const byId = new Map<string, StoredWorkspace>()

  for (const record of live) byId.set(record.id, record)
  // Bound entries win, so a workspace migrated to a project store shows its
  // project rather than a stale live-store copy left behind.
  for (const binding of await listBindings()) byId.set(binding.id, boundListEntry(binding))

  return [...byId.values()]
}

export async function getStoredWorkspace(id: string): Promise<StoredWorkspace | undefined> {
  const handle = getActiveHandle(id)

  if (handle) {
    const source = await readBoundSource(handle, id)

    if (source) {
      return readRecord({
        id,
        workspace: source.workspace,
        updatedAt: source.updatedAt,
        lastEditor: currentEditor,
      })
    }

    const record = await readProjectRecord(handle, id)

    return record ? readRecord(record as unknown as StoredWorkspaceOnDisk) : undefined
  }

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

  const handle = getActiveHandle(id)

  if (handle) {
    const sourceFileName = await writeBoundSource(handle, id, workspace)

    await writeProjectRecord(handle, {
      id,
      workspace,
      updatedAt: stamped.updatedAt,
      lastEditor: currentEditor,
    })
    await touchBinding(id, workspace.metadata.label ?? "", stamped.updatedAt)

    const binding = await getBinding(id)

    if (binding && binding.sourceFileName !== sourceFileName) {
      await saveBinding(id, { ...binding, sourceFileName })
    }

    return
  }

  await fetch(`${BASE}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stamped),
  })
}

export async function deleteStoredWorkspace(id: string): Promise<void> {
  const handle = getActiveHandle(id)

  if (handle) await deleteProjectRecord(handle, id)
  await deleteBinding(id)
  // Also clear any live-store copy, which covers an unbound workspace and a
  // leftover from before a migrate.
  await deleteLiveWorkspace(id)
}

/**
 * Removes only the editor's live-store copy, never a project store. Export calls
 * this after writing a workspace into its project folder, so the project store
 * becomes the single home and no stale live-store duplicate lingers.
 */
export async function deleteLiveWorkspace(id: string): Promise<void> {
  await fetch(`${BASE}/${encodeURIComponent(id)}`, { method: "DELETE" })
}

/**
 * What an imported workspace resolves to against the live store, matched by
 * `metadata.id`. Undefined from {@link findImportMatch} means no stored record
 * shares the id, so the import is a new workspace and the caller creates it.
 */
export interface ImportMatch {
  existing: StoredWorkspace
  labelChanged: boolean
  importIsOlder: boolean
}

/**
 * Finds the stored record an imported workspace would overwrite.
 *
 * Identity is `metadata.id`, so a workspace exported from the editor resolves
 * back to the record it came from. `labelChanged` flags a rename against that
 * record, and `importIsOlder` compares edit times so a caller can guard against
 * an older copy clobbering newer work. A missing id, or an id no record carries,
 * returns undefined: the import is a distinct workspace.
 */
export async function findImportMatch(workspace: Workspace): Promise<ImportMatch | undefined> {
  const id = workspace.metadata.id

  if (!id) return undefined
  const existing = await getStoredWorkspace(id)

  if (!existing) return undefined

  const existingLabel = existing.workspace.metadata.label ?? ""
  const importedLabel = workspace.metadata.label ?? ""

  return {
    existing,
    labelChanged: existingLabel !== importedLabel,
    importIsOlder: isOlderThan(workspace, existing),
  }
}

/**
 * True only when both edit times are known and the import predates the stored
 * record. Unknown times return false, so a missing timestamp never blocks an
 * import; it only removes the extra guard.
 */
function isOlderThan(imported: Workspace, existing: StoredWorkspace): boolean {
  const importedAt = imported.metadata.lastUpdate
  const existingAt = existing.workspace.metadata.lastUpdate ?? existing.updatedAt

  if (!importedAt || !existingAt) return false

  return importedAt < existingAt
}

/**
 * Returns a copy carrying a fresh `metadata.id`, so importing a workspace as a
 * separate entry cannot overwrite the record it shares an id with. Used when a
 * user declines to overwrite a matched record and keeps the import as its own
 * workspace.
 */
export function withFreshWorkspaceId(workspace: Workspace): Workspace {
  return { ...workspace, metadata: { ...workspace.metadata, id: crypto.randomUUID() } }
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

/** Reads the bound workspace source, or undefined when that file is not there. */
async function readBoundSource(
  root: FileSystemDirectoryHandle,
  id: string,
): Promise<{ workspace: Workspace; updatedAt: string } | undefined> {
  const binding = await getBinding(id)
  const fileName = await findProjectSourceFileName(root, binding?.sourceFileName)

  if (!fileName) return undefined

  const source = await readProjectSource(root, fileName)

  if (!source) return undefined

  return { workspace: source.workspace, updatedAt: source.updatedAt }
}

/**
 * Writes the bound workspace source and the project pointer. Uses the existing
 * source name when one is already bound or pointed, so a label change does not
 * create a second file.
 */
async function writeBoundSource(
  root: FileSystemDirectoryHandle,
  id: string,
  workspace: Workspace,
): Promise<string> {
  const binding = await getBinding(id)
  const platform = workspace.metadata.exportSettings?.platform ?? "react"
  const derived = workspaceSourceFileName(workspace, platform)
  const fileName =
    binding?.sourceFileName ?? (await findProjectSourceFileName(root, derived)) ?? derived

  await writeProjectSource(root, fileName, workspace)
  await writeProjectPointer(root, fileName)

  return fileName
}
