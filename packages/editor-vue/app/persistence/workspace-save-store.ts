import {
  type StoredWorkspace,
  saveStoredWorkspace,
} from "@seldon/editor/lib/storage/workspace-store"
import { defineStore } from "pinia"
import { ref } from "vue"

import type { Workspace } from "@seldon/core/workspace/types"

import { useDirtyStore } from "./dirty-store"

/** Optional record fields a save may patch alongside the workspace snapshot. */
type SavePatch = Pick<Partial<StoredWorkspace>, "name">

/**
 * Single writer for the local workspace. Persists the live snapshot, optionally
 * patching record fields such as the name, updates the owned record, and clears
 * the dirty flag. Autosave, force-save, and rename all flow through `saveNow` so
 * writes stay consistent. Mirrors the React `workspace-save-store`.
 */
export const useWorkspaceSaveStore = defineStore("workspace-save", () => {
  const record = ref<StoredWorkspace | null>(null)

  function setRecord(next: StoredWorkspace | null): void {
    record.value = next
  }

  async function saveNow(
    workspace: Workspace,
    patch?: SavePatch,
  ): Promise<void> {
    const current = record.value
    if (!current) return
    const next: StoredWorkspace = {
      ...current,
      ...patch,
      workspace,
      updatedAt: new Date().toISOString(),
    }
    await saveStoredWorkspace(next)
    record.value = next
    useDirtyStore().setDirty(false)
  }

  return { record, setRecord, saveNow }
})
