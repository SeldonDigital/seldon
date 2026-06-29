"use client"

import {
  type StoredWorkspace,
  saveStoredWorkspace,
} from "@lib/storage/workspace-store"
import { create } from "zustand"
import type { Workspace } from "@seldon/core/workspace/types"
import { setIsLocalWorkspaceDirty } from "@lib/project/hooks/use-workspace-sync-status"

/** Optional record fields a save may patch alongside the workspace snapshot. */
type SavePatch = Pick<Partial<StoredWorkspace>, "name">

interface WorkspaceSaveState {
  record: StoredWorkspace | null
  /** Seed the owner with the loaded record. Called once near the shell. */
  setRecord: (record: StoredWorkspace | null) => void
  /**
   * Single writer for the local workspace. Persists the live workspace snapshot
   * immediately, optionally patching record fields (such as the name), updates
   * the owned record, and clears the dirty flag. Autosave, the force-save
   * button, and rename all flow through here so writes stay consistent.
   */
  saveNow: (workspace: Workspace, patch?: SavePatch) => Promise<void>
}

export const useWorkspaceSaveStore = create<WorkspaceSaveState>((set, get) => ({
  record: null,
  setRecord: (record) => set({ record }),
  saveNow: async (workspace, patch) => {
    const record = get().record
    if (!record) return
    const next: StoredWorkspace = {
      ...record,
      ...patch,
      workspace,
      updatedAt: new Date().toISOString(),
    }
    await saveStoredWorkspace(next)
    set({ record: next })
    setIsLocalWorkspaceDirty(false)
  },
}))

/** Reactive workspace name from the owned record. */
export function useWorkspaceName(): string {
  return useWorkspaceSaveStore((state) => state.record?.name ?? "")
}

/** The shared single-writer save action. */
export function useSaveWorkspace(): WorkspaceSaveState["saveNow"] {
  return useWorkspaceSaveStore((state) => state.saveNow)
}
