import { useDispatch } from "@app/workspace/hooks/use-dispatch"
import { getCurrentWorkspace } from "@app/workspace/hooks/use-history"
import { useSelection } from "@app/workspace/hooks/use-selection"
import {
  applyTextEditPlan,
  clearTextEditSession,
  resolveTextEditSelection,
  rootIdForCreatedNode,
  startTextEditSession,
  textEditSessionStore,
} from "@seldon/editor/lib/canvas/text-edit"
import { useCallback } from "react"

import { useSharedStore } from "./use-shared-store"

import type { InstanceId, VariantId } from "@seldon/core"
import type { TextEditPlan, TextEditSession } from "@seldon/editor/lib/canvas/text-edit"

export function useTextEditSession() {
  const session = useSharedStore(textEditSessionStore, (state) => state.session)
  const dispatch = useDispatch()
  const { selectNode } = useSelection()

  const pinSelection = useCallback(
    (nodeId: string, rootId: string | null, workspace = getCurrentWorkspace()) => {
      const pinned = resolveTextEditSelection(workspace, nodeId, rootId)

      selectNode(pinned.nodeId as VariantId | InstanceId, pinned.rootId)
    },
    [selectNode],
  )

  const begin = useCallback(
    (next: TextEditSession) => {
      startTextEditSession(next)
      pinSelection(next.nodeId, next.rootId)
    },
    [pinSelection],
  )

  const end = useCallback(() => {
    clearTextEditSession()
  }, [])

  const commitPlan = useCallback(
    (plan: TextEditPlan) => {
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
    },
    [dispatch, pinSelection],
  )

  return { session, begin, end, commitPlan }
}
