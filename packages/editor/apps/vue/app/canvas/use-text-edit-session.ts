import { useSharedStore } from "@app/canvas/use-shared-store"
import { getCurrentWorkspace } from "@app/workspace/history-store"
import { useSelectionStore } from "@app/workspace/selection-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import {
  clearTextEditSession,
  startTextEditSession,
  textEditSessionStore,
} from "@seldon/editor/lib/canvas/text-edit"

import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"

import type { InstanceId, VariantId } from "@seldon/core"
import type { TextEditPlan, TextEditSession } from "@seldon/editor/lib/canvas/text-edit"

export function useTextEditSession() {
  const session = useSharedStore(textEditSessionStore, (state) => state.session)
  const dispatch = useDispatch()
  const selection = useSelectionStore()

  function begin(next: TextEditSession): void {
    startTextEditSession(next)
    selection.selectNode(next.nodeId as VariantId | InstanceId, next.rootId)
  }

  function end(): void {
    clearTextEditSession()
  }

  function commitPlan(plan: TextEditPlan): void {
    if (plan.actions.length === 0) {
      if (plan.nextNodeId) {
        const current = textEditSessionStore.getState().session

        startTextEditSession({
          nodeId: plan.nextNodeId,
          rootId: current?.rootId ?? null,
        })
        selection.selectNode(plan.nextNodeId as VariantId | InstanceId, current?.rootId ?? null)
      }

      return
    }

    const next = applyActions(getCurrentWorkspace(), plan.actions)

    dispatch({ type: "set_workspace", payload: { workspace: next } })

    if (plan.nextNodeId) {
      const current = textEditSessionStore.getState().session

      startTextEditSession({
        nodeId: plan.nextNodeId,
        rootId: current?.rootId ?? null,
      })
      selection.selectNode(plan.nextNodeId as VariantId | InstanceId, current?.rootId ?? null)
    }
  }

  return { session, begin, end, commitPlan }
}
