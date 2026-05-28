import type { ComponentEntry, EntryNodeId } from "../../types"
import { walkComponentTreeRefs } from "./walk-component-tree-refs"

/**
 * Lists every child index under this parent inside the board variant tree.
 * Indices start at zero and follow sibling order under that parent.
 *
 * The parent id may belong to a default, variant, or instance node that appears as a ref in that tree.
 *
 * Returns an empty array when this parent has no children or does not appear in the tree.
 *
 * @param board ComponentEntry whose variants hold the tree.
 * @param parentId Node id for the parent whose child indices you need.
 */
export function getChildrenIndices(
  board: ComponentEntry,
  parentId: EntryNodeId,
): number[] {
  let indices: number[] = []

  walkComponentTreeRefs(board.variants, (ref) => {
    if (ref.id !== parentId) return
    const children = ref.children ?? []
    indices = children.map((_, index) => index)
    return true
  })

  return indices
}
