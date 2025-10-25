import { useCallback, useEffect, useRef } from "react"
import { Action } from "@seldon/core/index"
import { getNodeIdAddedByAction } from "@seldon/core/workspace/helpers/get-node-id-added-by-action"
import { useSelection } from "./use-selection"
import { useWorkspace } from "./use-workspace"

/**
 * Hook that automatically selects a node after it's added by an action.
 * dispatchWithAutoSelect is a drop-in replacement for dispatch.
 */
export function useAutoSelectNode() {
  const { workspace, dispatch } = useWorkspace()
  const { selectNode } = useSelection()
  const pendingActionRef = useRef<Action | null>(null)

  // 1. Wait for workspace to update
  // 2. Select the node that was added by the stored action
  // 3. Clear the pending action
  useEffect(() => {
    if (!pendingActionRef.current) return

    try {
      const action = pendingActionRef.current

      const addedNodeId = getNodeIdAddedByAction(action, workspace)
      if (workspace.byId[addedNodeId]) {
        // Select the added node
        selectNode(addedNodeId)
      }
    } finally {
      pendingActionRef.current = null
    }
  }, [workspace, selectNode])

  const dispatchWithAutoSelect = useCallback(
    (action: Action) => {
      // Track the action for auto-selection
      pendingActionRef.current = action

      // Dispatch the action
      dispatch(action)
    },
    [dispatch],
  )

  return {
    dispatchWithAutoSelect,
  }
}
