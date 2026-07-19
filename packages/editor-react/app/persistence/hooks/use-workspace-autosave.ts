"use client"

import { useWorkspaceSaveStore } from "@app/persistence/workspace-save-store"
import type { StoredWorkspace } from "@lib/storage/workspace-store"
import { useEffect } from "react"
import { useDebounce } from "use-debounce"
import type { Workspace } from "@seldon/core/workspace/types"

/**
 * Debounced and unload-time persistence for the local workspace. Seeds the
 * shared save store with the loaded record, then routes every write through the
 * store's single `saveNow` writer so autosave, the force-save button, and
 * rename stay consistent.
 */
export function useWorkspaceAutosave(
  record: StoredWorkspace | null,
  workspace: Workspace | undefined,
  isDirty: boolean,
) {
  const setRecord = useWorkspaceSaveStore((state) => state.setRecord)
  const saveNow = useWorkspaceSaveStore((state) => state.saveNow)
  const [debouncedWorkspace] = useDebounce(workspace, 1000)

  useEffect(() => {
    setRecord(record)
  }, [record, setRecord])

  useEffect(() => {
    if (!debouncedWorkspace || !isDirty) return
    void saveNow(debouncedWorkspace)
  }, [debouncedWorkspace, isDirty, saveNow])

  useEffect(() => {
    const flush = () => {
      if (workspace) void saveNow(workspace)
    }
    window.addEventListener("beforeunload", flush)
    return () => window.removeEventListener("beforeunload", flush)
  }, [workspace, saveNow])
}
