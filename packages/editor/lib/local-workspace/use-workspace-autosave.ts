"use client"

import { useEffect, useRef } from "react"
import type { Workspace } from "@seldon/core/workspace/types"
import { useDebounce } from "use-debounce"
import { saveStoredWorkspace, type StoredWorkspace } from "@lib/storage/workspace-store"

export function useWorkspaceAutosave(
  record: StoredWorkspace | null,
  workspace: Workspace | undefined,
  isDirty: boolean,
) {
  const [debouncedWorkspace] = useDebounce(workspace, 1000)
  const recordRef = useRef(record)
  recordRef.current = record

  useEffect(() => {
    if (!recordRef.current || !debouncedWorkspace || !isDirty) return

    void saveStoredWorkspace({
      ...recordRef.current,
      workspace: debouncedWorkspace,
      updatedAt: new Date().toISOString(),
    })
  }, [debouncedWorkspace, isDirty])

  useEffect(() => {
    const flush = () => {
      if (!recordRef.current || !workspace) return
      void saveStoredWorkspace({
        ...recordRef.current,
        workspace,
        updatedAt: new Date().toISOString(),
      })
    }
    window.addEventListener("beforeunload", flush)
    return () => window.removeEventListener("beforeunload", flush)
  }, [workspace])
}
