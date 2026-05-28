import type { ComponentEntry, ComponentTreeRef, EntryNodeId } from "../../types"

/** Result of {@link getParentIds}. */
export interface ComponentParentIds {
  ancestors: EntryNodeId[]
  immediateParent: EntryNodeId | null
  inTree: boolean
}

function findAncestorIds(
  ref: ComponentTreeRef,
  ancestorIds: EntryNodeId[],
  nodeId: EntryNodeId,
): EntryNodeId[] | null {
  if (ref.id === nodeId) {
    return ancestorIds
  }

  const pathToChild = [...ancestorIds, ref.id]

  for (const child of ref.children ?? []) {
    const hit = findAncestorIds(child, pathToChild, nodeId)
    if (hit) return hit
  }

  return null
}

/**
 * Resolves parent ids for this node inside the board variant trees.
 *
 * - `ancestors` lists ids from the variant root through each ancestor down to the direct parent. Empty for a root ref.
 * - `immediateParent` is the direct parent id, or null for a root ref or when the node is not in this board tree.
 * - `inTree` is true when this node id appears under some variant root on this board. 
 * 
 * Use `inTree` to tell a missing node from a root ref, since both give an empty `ancestors` list and a null `immediateParent`.
 *
 * The node id may belong to a default, variant, or instance node that appears as a ref in that tree.
 *
 * @param board ComponentEntry whose variants hold the tree.
 * @param nodeId Node id whose parents you need.
 */
export function getParentIds(board: ComponentEntry, nodeId: EntryNodeId): ComponentParentIds {
  for (const root of board.variants) {
    const ancestors = findAncestorIds(root, [], nodeId)
    if (ancestors !== null) {
      const immediateParent =
        ancestors.length > 0 ? ancestors[ancestors.length - 1]! : null
      return {
        ancestors,
        immediateParent,
        inTree: true,
      }
    }
  }

  return {
    ancestors: [],
    immediateParent: null,
    inTree: false,
  }
}

/**
 * Gets the direct parent id for this node inside the board variant trees.
 *
 * Returns null when the node is a root ref, when it is not in this board tree, 
 * or when it has no parent in that tree.
 *
 * @param board ComponentEntry whose variants hold the tree.
 * @param nodeId Node id whose parent you need.
 */
export function getImmediateParentId(
  board: ComponentEntry,
  nodeId: EntryNodeId,
): EntryNodeId | null {
  return getParentIds(board, nodeId).immediateParent
}
