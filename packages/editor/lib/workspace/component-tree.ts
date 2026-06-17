import { getChildrenIds } from "@seldon/core/workspace/helpers/components/get-children-ids"
import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import type {
  Board,
  ComponentTreeRef,
  EntryNodeId,
} from "@seldon/core/workspace/types"
import { getBoardVariantRootIds } from "./workspace-accessors"

export type SidebarTreeRef = {
  id: EntryNodeId
  children?: SidebarTreeRef[]
}

/** Top-level variant roots for a catalog row. */
export function getVariantRootIds(board: Board): EntryNodeId[] {
  return getBoardVariantRootIds(board)
}

/** Direct child node ids from the board variant tree, not from `nodes`. */
export function getChildNodeIds(
  board: Board,
  parentId: EntryNodeId,
): EntryNodeId[] {
  return getChildrenIds(board, parentId)
}

export function walkComponentTree(
  board: Board,
  visit: (
    ref: ComponentTreeRef,
    parent: ComponentTreeRef | null,
  ) => boolean | void,
): void {
  walkBoardTreeRefs(board.variants, visit)
}

export function collectDescendantNodeIds(
  board: Board,
  rootId: EntryNodeId,
): EntryNodeId[] {
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
