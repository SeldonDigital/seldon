import { useMemo } from "react"
import { InstanceId, VariantId } from "@seldon/core/index"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useActiveBoard } from "@lib/workspace/use-active-board"
import { useWorkspace } from "@lib/workspace/use-workspace"

export interface VisibleNode {
  id: VariantId | InstanceId
  depth: number
}

export function useVisibleNodes() {
  const { workspace } = useWorkspace()
  const { activeBoard } = useActiveBoard()

  const visibleNodes = useMemo(() => {
    if (!activeBoard) return []
    const nodes: VisibleNode[] = []

    function recursivelyAddNodeIds(
      nodeId: VariantId | InstanceId,
      depth: number = 0,
    ) {
      const node = workspaceService.getNode(nodeId, workspace)

      nodes.push({ id: nodeId, depth })

      if (node.children) {
        for (const child of node.children) {
          recursivelyAddNodeIds(child, depth + 1)
        }
      }
    }
    for (const variantId of activeBoard.variants) {
      recursivelyAddNodeIds(variantId)
    }
    return nodes
  }, [activeBoard, workspace])

  return { visibleNodes }
}
