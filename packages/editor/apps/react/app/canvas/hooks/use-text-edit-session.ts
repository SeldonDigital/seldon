import { useDispatch } from "@app/workspace/hooks/use-dispatch"
import { getCurrentWorkspace } from "@app/workspace/hooks/use-history"
import { useSelection } from "@app/workspace/hooks/use-selection"
import {
  clearTextEditSession,
  startTextEditSession,
  textEditSessionStore,
} from "@seldon/editor/lib/canvas/text-edit"
import { useCallback } from "react"

import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"

import { useSharedStore } from "./use-shared-store"

import type { InstanceId, VariantId } from "@seldon/core"
import type { TextEditPlan, TextEditSession } from "@seldon/editor/lib/canvas/text-edit"

export function useTextEditSession() {
  const session = useSharedStore(textEditSessionStore, (state) => state.session)
  const dispatch = useDispatch()
  const { selectNode } = useSelection()

  const begin = useCallback(
    (next: TextEditSession) => {
      startTextEditSession(next)
      selectNode(next.nodeId as VariantId | InstanceId, next.rootId)
    },
    [selectNode],
  )

  const end = useCallback(() => {
    clearTextEditSession()
  }, [])

  const commitPlan = useCallback(
    (plan: TextEditPlan) => {
      if (plan.actions.length === 0) {
        if (plan.nextNodeId) {
          const current = textEditSessionStore.getState().session

          startTextEditSession({
            nodeId: plan.nextNodeId,
            rootId: current?.rootId ?? null,
          })
          selectNode(plan.nextNodeId as VariantId | InstanceId, current?.rootId ?? null)
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
        selectNode(plan.nextNodeId as VariantId | InstanceId, current?.rootId ?? null)
      }
    },
    [dispatch, selectNode],
  )

  return { session, begin, end, commitPlan }
}
