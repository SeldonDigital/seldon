import type { ComponentEntry, ComponentTreeRef, EntryNodeId } from "../../types"
import { walkComponentTreeRefs } from "./walk-component-tree-refs"

/**
 * Finds the tree ref for this node id inside the board variant list.
 * The returned ref includes every nested child ref under that node.
 *
 * Returns null when this id does not appear in any variant tree on this board.
 *
 * @param board ComponentEntry whose variants hold the tree.
 * @param variantId Node id that anchors the branch you need.
 */
export function getVariantTree(
  board: ComponentEntry,
  variantId: EntryNodeId,
): ComponentTreeRef | null {
  let tree: ComponentTreeRef | null = null

  walkComponentTreeRefs(board.variants, (ref) => {
    if (ref.id !== variantId) return
    tree = ref
    return true
  })

  return tree
}
