import { useSharedStore } from "@app/canvas/use-shared-store"
import { getCurrentWorkspace } from "@app/workspace/history-store"
import { useSelectionStore } from "@app/workspace/selection-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import {
  clearTextEditSession,
  resolveTextEditCommit,
  resolveTextEditSelection,
  startTextEditSession,
  textEditSessionStore,
} from "@seldon/editor/lib/canvas/text-edit"

import type { InstanceId, VariantId } from "@seldon/core"
import type { TextEditPlan, TextEditSession } from "@seldon/editor/lib/canvas/text-edit"

export function useTextEditSession() {
  const session = useSharedStore(textEditSessionStore, (state) => state.session)
  const dispatch = useDispatch()
  const selection = useSelectionStore()

  function pinSelection(
    nodeId: string,
    rootId: string | null,
    workspace = getCurrentWorkspace(),
  ): void {
    const pinned = resolveTextEditSelection(workspace, nodeId, rootId)

    selection.selectNode(pinned.nodeId as VariantId | InstanceId, pinned.rootId)
  }

  function begin(next: TextEditSession): void {
    startTextEditSession(next)
    pinSelection(next.nodeId, next.rootId)
  }

  function end(): void {
    clearTextEditSession()
  }

  function commitPlan(plan: TextEditPlan): void {
    const result = resolveTextEditCommit(
      getCurrentWorkspace(),
      textEditSessionStore.getState().session,
      plan,
    )

    if (result.kind === "noop" || result.kind === "fail") return

    if (result.kind === "apply") {
      dispatch({ type: "set_workspace", payload: { workspace: result.workspace } })
    }

    if (result.session) {
      startTextEditSession(result.session)
      pinSelection(result.session.nodeId, result.session.rootId, result.workspace)

      return
    }

    clearTextEditSession()
  }

  return { session, begin, end, commitPlan }
}
