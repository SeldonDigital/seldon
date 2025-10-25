import { useCallback } from "react"
import { useSelection } from "@lib/workspace/use-selection"

/**
 * Commands for selecting nodes and boards
 */
export function useSelectCommands() {
  const { selectedNode, selectNode } = useSelection()

  const selectOriginalNode = useCallback(() => {
    if (selectedNode && "instanceOf" in selectedNode) {
      selectNode(selectedNode.instanceOf)
    }
  }, [selectedNode, selectNode])

  const selectVariant = useCallback(() => {
    if (selectedNode && "variant" in selectedNode) {
      selectNode(selectedNode.variant)
    }
  }, [selectedNode, selectNode])

  return {
    selectOriginalNode,
    selectVariant,
  }
}
