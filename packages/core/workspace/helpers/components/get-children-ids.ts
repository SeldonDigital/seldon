import type { ComponentEntry, EntryNodeId } from "../../types"
import { walkComponentTreeRefs } from "./walk-component-tree-refs"

/**
 * Lists every child node id under this parent inside the board variant tree.
 * The parent id may belong to a default, variant, or instance node that appears as a ref in that tree.
 *
 * Returns an empty array when this parent has no children or does not appear in the tree.
 *
 * @param board ComponentEntry whose variants hold the tree.
 * @param parentId Node id for the parent whose children you need.
 */
export function getChildrenIds(board: ComponentEntry, parentId: EntryNodeId): EntryNodeId[] {
  let childIds: EntryNodeId[] = []

  walkComponentTreeRefs(board.variants, (ref) => {
    if (ref.id !== parentId) return
    childIds = (ref.children ?? []).map((child) => child.id)
    return true
  })

  return childIds
}
