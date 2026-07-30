import { saveStoredWorkspace } from "@seldon/editor/lib/storage/workspace-store"
import { defineStore } from "pinia"
import { ref } from "vue"

import { useDirtyStore } from "./dirty-store"

import type { Workspace } from "@seldon/core/workspace/types"
import type { StoredWorkspace } from "@seldon/editor/lib/storage/workspace-store"

/**
 * Single writer for the local workspace. Persists the live snapshot, updates the
 * owned record, and clears the dirty flag. Autosave and force-save both flow
 * through `saveNow` so writes stay consistent. Renaming needs no call of its own,
 * because the name is workspace state. Mirrors the React `workspace-save-store`.
 */
export const useWorkspaceSaveStore = defineStore("workspace-save", () => {
  const record = ref<StoredWorkspace | null>(null)

  function setRecord(next: StoredWorkspace | null): void {
    record.value = next
  }

  async function saveNow(workspace: Workspace): Promise<void> {
    const current = record.value

    if (!current) return
    const next: StoredWorkspace = {
      ...current,
      workspace,
      updatedAt: new Date().toISOString(),
    }

    await saveStoredWorkspace(next)
    record.value = next
    useDirtyStore().setDirty(false)
  }

  return { record, setRecord, saveNow }
})
