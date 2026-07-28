import { createStore, del, get, set } from "idb-keyval"
import { ensureHandlePermission } from "./handle-permission"

import type { UseStore } from "idb-keyval"

/**
 * Per-workspace folder the export dialog writes into, remembered so a user picks
 * it once rather than on every export.
 *
 * This is the write side, kept apart from the project link on purpose. A link is
 * created by an export and only ever read through, while a target is chosen for
 * an export and written to, so folding them together would cost the link the
 * read-only guarantee its callers rely on.
 *
 * A directory handle survives only through structured clone, so this lives in
 * IndexedDB. It uses its own database rather than the link's, because
 * `createStore` opens a database without a version and creates its object store
 * during the upgrade, so asking one database for a second store name finds no
 * upgrade to run and fails on first use.
 */

let store: UseStore | undefined

/** Opens the store on first use, so loading this module never reaches for `indexedDB`. */
function getStore(): UseStore {
  store ??= createStore("seldon-export-targets", "export-targets")

  return store
}

export interface ExportTarget {
  /** The project root the user picked. The components folder is created inside it. */
  directory: FileSystemDirectoryHandle
  pickedAt: string
}

/** Whether this browser can remember a target at all. */
export function isExportTargetSupported(): boolean {
  return (
    typeof window !== "undefined" && "showDirectoryPicker" in window && "indexedDB" in globalThis
  )
}

export async function getExportTarget(workspaceId: string): Promise<ExportTarget | undefined> {
  if (!isExportTargetSupported()) return undefined

  try {
    return await get<ExportTarget>(workspaceId, getStore())
  } catch {
    return undefined
  }
}

export async function saveExportTarget(
  workspaceId: string,
  directory: FileSystemDirectoryHandle,
): Promise<void> {
  if (!isExportTargetSupported()) return

  const target: ExportTarget = {
    directory,
    pickedAt: new Date().toISOString(),
  }

  try {
    await set(workspaceId, target, getStore())
  } catch {
    // A remembered folder is a convenience. Losing it must never fail an export.
  }
}

export async function deleteExportTarget(workspaceId: string): Promise<void> {
  if (!isExportTargetSupported()) return

  try {
    await del(workspaceId, getStore())
  } catch {
    // Nothing to recover: the target is already unusable.
  }
}

/**
 * Whether an export may write to this folder, asking for the grant when it has
 * lapsed. Call it from the gesture that starts the export, because a browser
 * refuses the prompt outside one.
 */
export function ensureExportTargetWritable(directory: FileSystemDirectoryHandle): Promise<boolean> {
  return ensureHandlePermission(directory, "readwrite")
}
