import { useDispatch } from "@app/workspace/hooks/use-dispatch"
import { getCurrentWorkspace } from "@app/workspace/hooks/use-history"
import { useSelection } from "@app/workspace/hooks/use-selection"
import {
  clearTextEditSession,
  resolveTextEditCommit,
  resolveTextEditSelection,
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
    },
    [dispatch, pinSelection],
  )

  return { session, begin, end, commitPlan }
}
