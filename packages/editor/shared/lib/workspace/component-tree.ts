import { getChildrenIds } from "@seldon/core/workspace/helpers/components/get-children-ids"
import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getBoardVariantRootIds } from "./workspace-accessors"

import type { Board, ComponentTreeRef, EntryNodeId } from "@seldon/core/workspace/types"

export type SidebarTreeRef = {
  id: EntryNodeId
  children?: SidebarTreeRef[]
}

/** Top-level variant roots for a catalog row. */
export function getVariantRootIds(board: Board): EntryNodeId[] {
  return getBoardVariantRootIds(board)
}

/** Direct child node ids from the board variant tree, not from `nodes`. */
export function getChildNodeIds(board: Board, parentId: EntryNodeId): EntryNodeId[] {
  return getChildrenIds(board, parentId)
}

export function walkComponentTree(
  board: Board,
  visit: (ref: ComponentTreeRef, parent: ComponentTreeRef | null) => boolean | void,
): void {
  walkBoardTreeRefs(board.variants, visit)
}

/**
 * Each node in the board mapped to the node above it.
 *
 * Variant roots are absent, since nothing is above them. Use it to walk upward, which
 * the tree itself cannot do because a `ComponentTreeRef` only points at its children.
 */
export function getParentNodeIds(board: Board): Map<EntryNodeId, EntryNodeId> {
  const parents = new Map<EntryNodeId, EntryNodeId>()

  walkComponentTree(board, (ref, parent) => {
    if (parent) {
      parents.set(ref.id, parent.id)
    }
  })

  return parents
}

export function collectDescendantNodeIds(board: Board, rootId: EntryNodeId): EntryNodeId[] {
  const ids: EntryNodeId[] = []

  function collect(ref: ComponentTreeRef) {
    for (const child of ref.children ?? []) {
      ids.push(child.id)
      collect(child)
    }
  }

  walkComponentTree(board, (ref) => {
    if (ref.id === rootId) {
      collect(ref)

      return true
    }
  })

  return ids
}
