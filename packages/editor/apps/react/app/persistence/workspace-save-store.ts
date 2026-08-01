"use client"

import { setIsLocalWorkspaceDirty } from "@app/project/hooks/use-workspace-sync-status"
import { saveStoredWorkspace } from "@seldon/editor/lib/storage/workspace-store"
import { create } from "zustand"

import type { Workspace } from "@seldon/core/workspace/types"
import type { StoredWorkspace } from "@seldon/editor/lib/storage/workspace-store"

interface WorkspaceSaveState {
  record: StoredWorkspace | null
  /**
   * Id of the workspace the editor has successfully loaded into history. Saving
   * waits on this, so a load that never completes cannot write the empty
   * starting workspace over a stored file.
   */
  loadedWorkspaceId: string | null
  /** Seed the owner with the loaded record. Called once near the shell. */
  setRecord: (record: StoredWorkspace | null) => void
  /** Opens saving for a workspace whose content is now in history. */
  markLoaded: (workspaceId: string) => void
  /**
   * Single writer for the local workspace. Persists the live workspace snapshot
   * immediately, updates the owned record, and clears the dirty flag. Autosave
   * and the force-save button both flow through here so writes stay consistent.
   * Renaming needs no call of its own, because the name is workspace state.
   */
  saveNow: (workspace: Workspace) => Promise<void>
}

export const useWorkspaceSaveStore = create<WorkspaceSaveState>((set, get) => ({
  record: null,
  loadedWorkspaceId: null,
  setRecord: (record) => set({ record }),
  markLoaded: (workspaceId) => set({ loadedWorkspaceId: workspaceId }),
  saveNow: async (workspace) => {
    const { record, loadedWorkspaceId } = get()

    if (!record || record.id !== loadedWorkspaceId) return
    const next: StoredWorkspace = {
      ...record,
      workspace,
      updatedAt: new Date().toISOString(),
    }

    await saveStoredWorkspace(next)
    set({ record: next })
    setIsLocalWorkspaceDirty(false)
  },
}))

/** The shared single-writer save action. */
export function useSaveWorkspace(): WorkspaceSaveState["saveNow"] {
  return useWorkspaceSaveStore((state) => state.saveNow)
}
