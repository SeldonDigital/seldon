"use client"

import { useWorkspaceSaveStore } from "@app/persistence/workspace-save-store"
import { useDispatch } from "@app/workspace/hooks/use-dispatch"
import { getStoredWorkspace } from "@seldon/editor/lib/storage/workspace-store"
import { useEffect, useRef } from "react"

import type { StoredWorkspace } from "@seldon/editor/lib/storage/workspace-store"

/**
 * Refreshes the open workspace when the shared store changes outside this tab,
 * such as an MCP commit against the same `.seldon/workspaces` file. On window
 * focus it reads the stored record, and when the store is newer than the tab's
 * last write and the tab is clean, it adopts the stored workspace as one undo
 * step. A dirty tab is left untouched, so a local edit is never clobbered by a
 * remote change. The baseline is the save store's own record, so the tab's
 * autosaves never trigger a self-reload.
 */
export function useWorkspaceRemoteRefresh(record: StoredWorkspace, isDirty: boolean): void {
  const dispatch = useDispatch()
  const setRecord = useWorkspaceSaveStore((state) => state.setRecord)
  const isDirtyRef = useRef(isDirty)

  useEffect(() => {
    isDirtyRef.current = isDirty
  }, [isDirty])

  useEffect(() => {
    const workspaceId = record.id

    if (!workspaceId) return

    const refresh = async () => {
      if (isDirtyRef.current) return
      const stored = await getStoredWorkspace(workspaceId)

      if (!stored) return
      const baseline = useWorkspaceSaveStore.getState().record?.updatedAt ?? record.updatedAt

      if (stored.updatedAt <= baseline) return
      dispatch({ type: "set_workspace", payload: { workspace: stored.workspace } })
      setRecord(stored)
    }

    const onFocus = () => {
      void refresh()
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void refresh()
    }

    window.addEventListener("focus", onFocus)
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      window.removeEventListener("focus", onFocus)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [record.id, record.updatedAt, dispatch, setRecord])
}
