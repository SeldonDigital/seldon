import type { Action } from "@seldon/core"
import { getNodeIdAddedByAction } from "@seldon/core/workspace/helpers/nodes/get-node-id-added-by-action"
import { useSelectionStore } from "@lib/stores/selection-store"
import { useDispatch } from "@lib/workspace/use-dispatch"

/**
 * Dispatches an action and selects the node it added. Mirrors the React
 * `useAutoSelectNode`, but reads the node id from the workspace the dispatch
 * returns synchronously instead of waiting for an effect. A drop-in replacement
 * for `dispatch` for add actions.
 */
export function useAutoSelectNode() {
  const dispatch = useDispatch()
  const selection = useSelectionStore()

  function dispatchWithAutoSelect(action: Action): void {
    const next = dispatch(action)
    if (!next) return
    const addedNodeId = getNodeIdAddedByAction(action, next)
    if (addedNodeId && next.nodes[addedNodeId]) {
      selection.selectNode(addedNodeId)
    }
  }

  return { dispatchWithAutoSelect }
}
