import { EntryNodeId, Workspace } from "../../types"
import { walkBoardTreeRefs } from "../components/walk-board-tree-refs"

/**
 * Returns true when the variant id appears as a child reference under some node in any board variant tree.
 *
 * @param variantId Variant id to check.
 * @param workspace Workspace that holds the boards.
 */
export function isVariantInUse(variantId: EntryNodeId, workspace: Workspace) {
  for (const board of Object.values(workspace.boards)) {
    let isUsed = false
    walkBoardTreeRefs(board.variants, (ref) => {
      if (!ref.children?.some((child) => child.id === variantId)) return
      isUsed = true
      return true
    })
    if (isUsed) return true
  }
  return false
}
