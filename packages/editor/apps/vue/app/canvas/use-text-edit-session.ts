import { useSharedStore } from "@app/canvas/use-shared-store"
import { getCurrentWorkspace } from "@app/workspace/history-store"
import { useSelectionStore } from "@app/workspace/selection-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import {
  applyTextEditPlan,
  clearTextEditSession,
  resolveTextEditSelection,
  rootIdForCreatedNode,
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
    const current = textEditSessionStore.getState().session
    const workspace = getCurrentWorkspace()

    if (plan.actions.length === 0 && !plan.liveEnter && !plan.liveMark) {
      if (plan.nextNodeId) {
        const rootId = current
          ? rootIdForCreatedNode(workspace, current, plan.nextNodeId)
          : plan.nextNodeId

        startTextEditSession({
          nodeId: plan.nextNodeId,
          rootId,
          caretOffset: plan.nextOffset,
        })
        pinSelection(plan.nextNodeId, rootId, workspace)
      }

      return
    }

    let applied

    try {
      applied = applyTextEditPlan(workspace, plan)
    } catch {
      return
    }

    dispatch({ type: "set_workspace", payload: { workspace: applied.workspace } })

    if (applied.nextNodeId) {
      const rootId = current
        ? rootIdForCreatedNode(applied.workspace, current, applied.nextNodeId)
        : applied.nextNodeId

      startTextEditSession({
        nodeId: applied.nextNodeId,
        rootId,
        caretOffset: applied.nextOffset,
      })
      pinSelection(applied.nextNodeId, rootId, applied.workspace)
    } else {
      clearTextEditSession()
    }
  }

  return { session, begin, end, commitPlan }
}
