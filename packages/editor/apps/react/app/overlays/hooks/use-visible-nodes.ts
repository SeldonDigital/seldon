import { useActiveBoard } from "@app/workspace/hooks/use-active-board"
import { getChildNodeIds, getVariantRootIds } from "@seldon/editor/lib/workspace/component-tree"
import { useMemo } from "react"

import type { InstanceId, VariantId } from "@seldon/core/index"

export interface VisibleNode {
  id: VariantId | InstanceId
  depth: number
}

/**
 * Returns visible nodes from the active board variant tree (same walk as the objects sidebar).
 */
export function useVisibleNodes() {
  const { activeBoard } = useActiveBoard()

  // The walk reads only the active board's variant tree (`getVariantRootIds` and
  // `getChildNodeIds` read `board.variants`, never `workspace.nodes`), so it
  // depends solely on the board entry. Reducers keep that entry reference stable
  // across node property edits, so this recomputes only on structural board
  // changes rather than on every workspace edit.
  const visibleNodes = useMemo(() => {
    if (!activeBoard) return []
    const board = activeBoard
    const nodes: VisibleNode[] = []
    const visited = new Set<string>()

    function walk(nodeId: VariantId | InstanceId, depth: number) {
      if (visited.has(nodeId)) return
      visited.add(nodeId)
      nodes.push({ id: nodeId, depth })

      for (const childId of getChildNodeIds(board, nodeId)) {
        walk(childId as VariantId | InstanceId, depth + 1)
      }
    }

    for (const variantId of getVariantRootIds(board)) {
      walk(variantId as VariantId, 0)
    }

    return nodes
  }, [activeBoard])

  return { visibleNodes }
}
