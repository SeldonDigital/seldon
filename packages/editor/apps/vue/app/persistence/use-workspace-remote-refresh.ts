import { useWorkspaceSaveStore } from "@app/persistence/workspace-save-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import { getStoredWorkspace } from "@seldon/editor/lib/storage/workspace-store"
import { onBeforeUnmount, onMounted, watch } from "vue"

import type { StoredWorkspace } from "@seldon/editor/lib/storage/workspace-store"
import type { Ref } from "vue"

/**
 * Refreshes the open workspace when the shared store changes outside this tab,
 * such as an MCP commit against the same `.seldon/workspaces` file. On window
 * focus it reads the stored record, and when the store is newer than the tab's
 * last write and the tab is clean, it adopts the stored workspace as one undo
 * step. A dirty tab is left untouched, so a local edit is never clobbered by a
 * remote change. The baseline is the save store's own record, so the tab's
 * autosaves never trigger a self-reload. Mirrors the React
 * `useWorkspaceRemoteRefresh`.
 */
export function useWorkspaceRemoteRefresh(
  record: Ref<StoredWorkspace | null>,
  isDirty: Ref<boolean>,
): void {
  const dispatch = useDispatch()
  const save = useWorkspaceSaveStore()
  let isDirtyNow = isDirty.value

  const stopDirty = watch(isDirty, (value) => {
    isDirtyNow = value
  })

  async function refresh(): Promise<void> {
    if (isDirtyNow) return
    const current = record.value

    if (!current?.id) return
    const stored = await getStoredWorkspace(current.id)

    if (!stored) return
    const baseline = save.record?.updatedAt ?? current.updatedAt

    if (stored.updatedAt <= baseline) return
    dispatch({ type: "set_workspace", payload: { workspace: stored.workspace } })
    save.setRecord(stored)
  }

  function onFocus(): void {
    void refresh()
  }

  function onVisibilityChange(): void {
    if (document.visibilityState === "visible") void refresh()
  }

  onMounted(() => {
    window.addEventListener("focus", onFocus)
    document.addEventListener("visibilitychange", onVisibilityChange)
  })

  onBeforeUnmount(() => {
    window.removeEventListener("focus", onFocus)
    document.removeEventListener("visibilitychange", onVisibilityChange)
    stopDirty()
  })
}
