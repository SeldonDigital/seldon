import { useCallback } from "react"
import { ComponentId } from "@seldon/core/components/constants"
import { InstanceId, VariantId } from "@seldon/core/index"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { useAddToast } from "@components/toaster/use-add-toast"
import { useCanvasHoverState } from "../use-canvas-hover-state"

/**
 * Commands for adding and removing nodes and boards
 */
export function useAddRemoveCommands() {
  const {
    selectedNode,
    selectedBoard,
    selectNode,
    selectBoard,
    selectedBoardId,
  } = useSelection()
  const { workspace, dispatch } = useWorkspace()
  const { setHoverState, hoverState } = useCanvasHoverState()
  const addToast = useAddToast()

  const addBoard = useCallback(
    (componentId: ComponentId) => {
      dispatch({
        type: "add_board",
        payload: {
          componentId,
        },
      })

      selectBoard(componentId)
    },
    [dispatch, selectBoard],
  )

  const duplicateSelectedNode = useCallback(() => {
    const nodeId = selectedNode?.id
    if (!nodeId) {
      addToast("No node selected")
      return
    }

    dispatch({
      type: "duplicate_node",
      payload: { nodeId },
    })
  }, [selectedNode, dispatch, addToast])

  const removeNode = useCallback(
    (nodeId: VariantId | InstanceId) => {
      const node = workspaceService.getNode(nodeId, workspace)
      if (selectedNode?.id === nodeId) {
        selectNode(
          workspaceService.findAdjacent(node, "before", workspace)?.id ??
            workspaceService.findAdjacent(node, "after", workspace)?.id ??
            null,
        )
      }
      if (hoverState?.objectId === nodeId) {
        setHoverState(null)
      }

      dispatch({
        type: "remove_node",
        payload: { nodeId },
      })
    },
    [
      workspace,
      selectedNode?.id,
      hoverState?.objectId,
      dispatch,
      selectNode,
      setHoverState,
    ],
  )

  const removeBoard = useCallback(
    (componentId: ComponentId) => {
      if (componentId === selectedBoardId) {
        selectBoard(null)
      }

      dispatch({
        type: "remove_board",
        payload: {
          componentId,
        },
      })
    },
    [selectedBoardId, selectBoard, dispatch],
  )

  const deleteSelection = useCallback(() => {
    if (selectedNode) {
      removeNode(selectedNode.id)
    }

    if (selectedBoard) {
      removeBoard(selectedBoard.id)
    }
  }, [selectedNode, selectedBoard, removeNode, removeBoard])

  const duplicateSelection = useCallback(() => {
    if (!selectedNode) return

    duplicateSelectedNode()
  }, [selectedNode, duplicateSelectedNode])

  return {
    addBoard,
    deleteSelection,
    duplicateSelection,
  }
}
