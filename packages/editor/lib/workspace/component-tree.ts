import { getChildrenIds } from "@seldon/core/workspace/helpers/components/get-children-ids"
import { walkComponentTreeRefs } from "@seldon/core/workspace/helpers/components/walk-component-tree-refs"
import type {
  Board,
  ComponentTreeRef,
  EntryNode,
  EntryNodeId,
  Workspace,
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

/** Direct child refs for a parent in the board tree. */
export function getChildRefs(
  board: Board,
  parentId: EntryNodeId,
): ComponentTreeRef[] {
  let refs: ComponentTreeRef[] = []

  walkComponentTreeRefs(board.variants, (ref) => {
    if (ref.id !== parentId) return
    refs = ref.children ?? []
    return true
  })

  return refs
}

export function walkComponentTree(
  board: Board,
  visit: (
    ref: ComponentTreeRef,
    parent: ComponentTreeRef | null,
  ) => boolean | void,
): void {
  walkComponentTreeRefs(board.variants, visit)
}

export function getEntryNode(
  workspace: Workspace,
  nodeId: EntryNodeId,
): EntryNode | undefined {
  return workspace.nodes[nodeId]
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
