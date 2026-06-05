import { useCallback } from "react"
import { parseNodeLink } from "@seldon/core/workspace/model/template-ref"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"

/**
 * Commands for selecting nodes and boards
 */
export function useSelectCommands() {
  const { selectedNode, selectNode } = useSelection()
  const { workspace } = useWorkspace()

  const selectOriginalNode = useCallback(() => {
    if (!selectedNode || !workspaceService.isInstance(selectedNode)) {
      return
    }
    const link = parseNodeLink(selectedNode.template)
    if (link?.kind === "node") {
      selectNode(link.nodeId)
    }
  }, [selectedNode, selectNode])

  const selectVariant = useCallback(() => {
    if (!selectedNode || !workspaceService.isInstance(selectedNode)) {
      return
    }
    const root = workspaceService.getRootVariant(selectedNode, workspace)
    selectNode(root.id)
  }, [selectedNode, selectNode, workspace])

  const canSelectOriginal =
    selectedNode !== null &&
    workspaceService.isInstance(selectedNode) &&
    parseNodeLink(selectedNode.template)?.kind === "node"

  const canSelectVariant =
    selectedNode !== null && workspaceService.isInstance(selectedNode)

  return {
    selectOriginalNode,
    selectVariant,
    canSelectOriginal,
    canSelectVariant,
  }
}
