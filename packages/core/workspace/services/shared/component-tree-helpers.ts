import type {
  ComponentEntry,
  ComponentTreeRef,
  EntryNodeId,
} from "../../types"
import { walkComponentTreeRefs } from "../../helpers/components/walk-component-tree-refs"

export function collectDescendantTreeIds(ref: ComponentTreeRef): EntryNodeId[] {
  const ids: EntryNodeId[] = [ref.id]
  for (const child of ref.children ?? []) {
    ids.push(...collectDescendantTreeIds(child))
  }
  return ids
}

export function insertComponentTreeChild(
  board: ComponentEntry,
  parentId: EntryNodeId,
  childRef: ComponentTreeRef,
  index?: number,
): boolean {
  let inserted = false
  walkComponentTreeRefs(board.variants, (ref) => {
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
  board: ComponentEntry,
  childId: EntryNodeId,
): boolean {
  let removed = false
  walkComponentTreeRefs(board.variants, (ref) => {
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
  board: ComponentEntry,
  nodeId: EntryNodeId,
): ComponentTreeRef | null {
  let found: ComponentTreeRef | null = null
  walkComponentTreeRefs(board.variants, (ref) => {
    if (ref.id === nodeId) {
      found = ref
      return true
    }
  })
  return found
}
