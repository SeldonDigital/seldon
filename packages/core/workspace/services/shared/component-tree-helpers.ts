import type {
  Board,
  ComponentTreeRef,
  EntryNodeId,
} from "../../types"
import { walkBoardTreeRefs } from "../../helpers/components/walk-board-tree-refs"

export function collectDescendantTreeIds(ref: ComponentTreeRef): EntryNodeId[] {
  const ids: EntryNodeId[] = [ref.id]
  for (const child of ref.children ?? []) {
    ids.push(...collectDescendantTreeIds(child))
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
