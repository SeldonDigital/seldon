import { walkBoardTreeRefs } from "../../helpers/components/walk-board-tree-refs"
import type { Board, ComponentTreeRef, EntryNodeId } from "../../types"

/**
 * Collects every node id referenced by board trees, skipping the subtree rooted
 * at `excludedRootId`. Schema instantiation can share one workspace node across
 * sibling trees through fingerprint-based instance reuse, so deleting a subtree
 * must keep node rows that other trees still reference.
 */
export function collectReferencedTreeIdsExcludingSubtree(
  boards: Iterable<Board | undefined>,
  excludedRootId: EntryNodeId,
): Set<EntryNodeId> {
  const ids = new Set<EntryNodeId>()
  const visit = (ref: ComponentTreeRef): void => {
    if (ref.id === excludedRootId) return
    ids.add(ref.id)
    for (const child of ref.children ?? []) {
      visit(child)
    }
  }
  for (const board of boards) {
    if (!board) continue
    for (const ref of board.variants) {
      visit(ref)
    }
  }
  return ids
}

export function insertComponentTreeChild(
  board: Board,
  parentId: EntryNodeId,
  childRef: ComponentTreeRef,
  index?: number,
): boolean {
  let inserted = false
  walkBoardTreeRefs(board.variants, (ref) => {
    if (ref.id !== parentId) return
    const children = ref.children ?? (ref.children = [])
    if (index === undefined || index <= 0) {
      children.unshift(childRef)
    } else if (index >= children.length) {
      children.push(childRef)
    } else {
      children.splice(index, 0, childRef)
    }
    inserted = true
    return true
  })
  return inserted
}

export function removeComponentTreeChild(
  board: Board,
  childId: EntryNodeId,
): boolean {
  let removed = false
  walkBoardTreeRefs(board.variants, (ref) => {
    const children = ref.children
    if (!children?.length) return
    const idx = children.findIndex((c) => c.id === childId)
    if (idx >= 0) {
      children.splice(idx, 1)
      removed = true
      return true
    }
  })
  return removed
}

export function findTreeRef(
  board: Board,
  nodeId: EntryNodeId,
): ComponentTreeRef | null {
  let found: ComponentTreeRef | null = null
  walkBoardTreeRefs(board.variants, (ref) => {
    if (ref.id === nodeId) {
      found = ref
      return true
    }
  })
  return found
}
