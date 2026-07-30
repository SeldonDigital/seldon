"use client"

import { setIsLocalWorkspaceDirty } from "@app/project/hooks/use-workspace-sync-status"
import { saveStoredWorkspace } from "@seldon/editor/lib/storage/workspace-store"
import { create } from "zustand"

import type { Workspace } from "@seldon/core/workspace/types"
import type { StoredWorkspace } from "@seldon/editor/lib/storage/workspace-store"

interface WorkspaceSaveState {
  record: StoredWorkspace | null
  /** Seed the owner with the loaded record. Called once near the shell. */
  setRecord: (record: StoredWorkspace | null) => void
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
  setRecord: (record) => set({ record }),
  saveNow: async (workspace) => {
    const record = get().record

    if (!record) return
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
