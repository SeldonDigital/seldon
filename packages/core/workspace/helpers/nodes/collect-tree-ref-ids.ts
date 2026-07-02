import type { ComponentTreeRef, EntryNodeId } from "../../types"

/** Collects `ref.id` plus every descendant id in the tree, depth first. */
export function collectTreeRefIds(ref: ComponentTreeRef): EntryNodeId[] {
  const ids: EntryNodeId[] = [ref.id]
  for (const child of ref.children ?? []) {
    ids.push(...collectTreeRefIds(child))
  }
  return ids
}
