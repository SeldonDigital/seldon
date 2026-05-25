import { useMemo } from "react"
import { InstanceId, VariantId } from "@seldon/core/index"
import {
  getChildNodeIds,
  getVariantRootIds,
} from "@lib/workspace/component-tree"
import { useActiveBoard } from "@lib/workspace/use-active-board"
import { useWorkspace } from "@lib/workspace/use-workspace"

export interface VisibleNode {
  id: VariantId | InstanceId
  depth: number
}

/**
 * Returns visible nodes from the active board variant tree (same walk as the objects sidebar).
 */
export function useVisibleNodes() {
  const { workspace } = useWorkspace()
  const { activeBoard } = useActiveBoard()

  const visibleNodes = useMemo(() => {
    if (!activeBoard) return []
    const nodes: VisibleNode[] = []

    function walk(nodeId: VariantId | InstanceId, depth: number) {
      nodes.push({ id: nodeId, depth })
      for (const childId of getChildNodeIds(activeBoard, nodeId)) {
        walk(childId as VariantId | InstanceId, depth + 1)
      }
    }

    for (const variantId of getVariantRootIds(activeBoard)) {
      walk(variantId as VariantId, 0)
    }

    return nodes
  }, [activeBoard])

  return { visibleNodes }
}
