import { createStore, del, entries, get, set } from "idb-keyval"
import { ensureHandlePermission } from "./handle-permission"

import type { UseStore } from "idb-keyval"

/**
 * Per-workspace binding to the project folder a workspace lives in.
 *
 * A workspace becomes bound when it is exported into a project. From then on it
 * persists into that project's `.seldon/workspaces` folder rather than the
 * editor's live store, so the editor and the project's MCP server share one
 * store. The binding holds the project root handle plus a small mirror of the
 * last save, so the home list can show a bound workspace without asking for the
 * folder grant first.
 *
 * A directory handle survives only through structured clone, so this lives in
 * IndexedDB. It uses its own database, because `createStore` opens a database
 * without a version and creates its object store during the upgrade, so asking
 * one database for a second store name finds no upgrade to run and fails.
 */

let store: UseStore | undefined

/** Opens the store on first use, so loading this module never reaches for `indexedDB`. */
function getStore(): UseStore {
  store ??= createStore("seldon-workspace-bindings", "workspace-bindings")

  return store
}

export interface WorkspaceBinding {
  /** The project root the workspace was exported into. The store sits under it. */
  directory: FileSystemDirectoryHandle
  /** The project folder name, shown on the home card. */
  projectName: string
  /** Last saved workspace label, mirrored so the home list needs no grant. */
  label: string
  /** Last save time, mirrored for the home list. */
  updatedAt: string
  boundAt: string
}

/** A binding paired with the workspace id it belongs to. */
export interface WorkspaceBindingEntry extends WorkspaceBinding {
  id: string
}

/**
 * Handles whose readwrite grant is confirmed for this session. Populated by
 * `activateBinding` from a user gesture and read by the store router, so autosave
 * writes to a project folder without prompting and never silently misfires.
 */
const activeHandles = new Map<string, FileSystemDirectoryHandle>()

/** Whether this browser can hold a binding at all. */
export function isBindingSupported(): boolean {
  return (
    typeof window !== "undefined" && "showDirectoryPicker" in window && "indexedDB" in globalThis
  )
}

export async function getBinding(workspaceId: string): Promise<WorkspaceBinding | undefined> {
  if (!isBindingSupported()) return undefined

  try {
    return await get<WorkspaceBinding>(workspaceId, getStore())
  } catch {
    return undefined
  }
}

export async function saveBinding(workspaceId: string, binding: WorkspaceBinding): Promise<void> {
  if (!isBindingSupported()) return

  try {
    await set(workspaceId, binding, getStore())
  } catch {
    // A binding is a convenience. Losing it must never fail the export that set it.
  }
}

export async function deleteBinding(workspaceId: string): Promise<void> {
  activeHandles.delete(workspaceId)

  if (!isBindingSupported()) return

  try {
    await del(workspaceId, getStore())
  } catch {
    // Nothing to recover: the binding is already unusable.
  }
}

/** Every stored binding, so the home list can show bound workspaces. */
export async function listBindings(): Promise<WorkspaceBindingEntry[]> {
  if (!isBindingSupported()) return []

  try {
    const rows = await entries<string, WorkspaceBinding>(getStore())

    return rows.map(([id, binding]) => ({ id, ...binding }))
  } catch {
    return []
  }
}

/**
 * Confirms readwrite access to a bound folder and caches the handle for the
 * session. Call it from the gesture that opens, imports, or exports, because a
 * browser only grants during an interaction. Returns false when there is no
 * binding or the grant is refused, so the caller can fall back to the live store.
 */
export async function activateBinding(workspaceId: string): Promise<boolean> {
  const binding = await getBinding(workspaceId)

  if (!binding) return false

  const granted = await ensureHandlePermission(binding.directory, "readwrite")

  if (!granted) return false

  activeHandles.set(workspaceId, binding.directory)

  return true
}

/**
 * The bound folder handle for a workspace when its grant is live this session,
 * or undefined. The store router uses this to choose the project store over the
 * live store, so a write never prompts and never fails outside a gesture.
 */
export function getActiveHandle(workspaceId: string): FileSystemDirectoryHandle | undefined {
  return activeHandles.get(workspaceId)
}

/** Refreshes a binding's mirrored label and time after a save. */
export async function touchBinding(
  workspaceId: string,
  label: string,
  updatedAt: string,
): Promise<void> {
  const binding = await getBinding(workspaceId)

  if (!binding) return

  await saveBinding(workspaceId, { ...binding, label, updatedAt })
}
