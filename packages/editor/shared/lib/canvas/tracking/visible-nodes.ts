import { getChildNodeIds, getVariantRootIds } from "../../workspace/component-tree"

import type { Board } from "@seldon/core/workspace/types"

/**
 * Flat list of every node id in a board's variant trees, in the same walk order
 * the objects sidebar uses. Drives the per-node wireframe outlines on the canvas
 * so both editors track and outline the same node set.
 */
export function getVisibleNodeIds(board: Board): string[] {
  const ids: string[] = []
  const visited = new Set<string>()

  function walk(nodeId: string): void {
    if (visited.has(nodeId)) return
    visited.add(nodeId)
    ids.push(nodeId)

    for (const childId of getChildNodeIds(board, nodeId)) {
      walk(childId)
    }
  }

  for (const rootId of getVariantRootIds(board)) {
    walk(rootId)
  }

  return ids
}
