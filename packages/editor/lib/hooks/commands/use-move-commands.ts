import { useCallback } from "react"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId } from "@seldon/core/components/constants"
import { InstanceId, VariantId, invariant } from "@seldon/core/index"
import { nodeAllowsReordering } from "@seldon/core/workspace/helpers/node-allows-reordering"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { useAddToast } from "@components/toaster/use-add-toast"

/**
 * Commands for moving nodes and boards
 */
export function useMoveCommands() {
  const { selection } = useSelection()
  const { workspace, dispatch } = useWorkspace()
  const addToast = useAddToast()

  /**
   * Moving objects up or down
   */

  const moveBoardUpOrDown = useCallback(
    (boardId: ComponentId, direction: "up" | "down") => {
      const board = workspaceService.getBoard(boardId, workspace)
      const currentOrder = board.order

      dispatch({
        type: "reorder_board",
        payload: {
          componentId: boardId,
          // When moving down, we need to index to be higher than the next item whos index is 1 higher
          newIndex: direction === "up" ? currentOrder - 1 : currentOrder + 2,
        },
      })
    },
    [workspace, dispatch],
  )

  const moveBoardUp = useCallback(
    (boardId: ComponentId) => {
      moveBoardUpOrDown(boardId, "up")
    },
    [moveBoardUpOrDown],
  )

  const moveBoardDown = useCallback(
    (boardId: ComponentId) => {
      moveBoardUpOrDown(boardId, "down")
    },
    [moveBoardUpOrDown],
  )

  const moveChildUpOrDown = useCallback(
    (nodeId: InstanceId, direction: "up" | "down") => {
      const parent = workspaceService.findParentNode(nodeId, workspace)
      invariant(parent, "Parent not found")
      invariant(parent.children, "Parent does not have children")

      if (!nodeAllowsReordering(parent.id, workspace)) {
        const schema = getComponentSchema(parent.component)
        addToast(
          `${schema.name} component does not allow reordering of child components`,
        )
        return
      }

      const currentIndex = parent.children.indexOf(nodeId)
      const isAtLimit =
        direction === "up"
          ? currentIndex <= 0
          : currentIndex === -1 || currentIndex >= parent.children.length - 1

      if (isAtLimit) return

      dispatch({
        type: "reorder_node",
        payload: {
          nodeId: nodeId,
          newIndex: currentIndex + (direction === "up" ? -1 : 1),
        },
      })
    },
    [workspace, dispatch, addToast],
  )

  const moveChildUp = useCallback(
    (nodeId: InstanceId) => {
      moveChildUpOrDown(nodeId, "up")
    },
    [moveChildUpOrDown],
  )

  const moveChildDown = useCallback(
    (nodeId: InstanceId) => {
      moveChildUpOrDown(nodeId, "down")
    },
    [moveChildUpOrDown],
  )

  const moveVariant = useCallback(
    (variantId: VariantId, index: number) => {
      const variant = workspaceService.getVariant(variantId, workspace)
      if (workspaceService.isDefaultVariant(variant) || index === 0) {
        addToast("Default variant cannot be moved or replaced")
        return
      }

      dispatch({
        type: "reorder_node",
        payload: { nodeId: variantId, newIndex: index },
      })
    },
    [workspace, dispatch, addToast],
  )

  const moveVariantUp = useCallback(
    (variantId: VariantId) => {
      const variant = workspaceService.getVariant(variantId, workspace)
      if (workspaceService.isDefaultVariant(variant)) {
        addToast("Default variant cannot be moved")
        return
      }

      const board = workspaceService.findBoardForVariant(variant, workspace)
      invariant(board, "Board not found")

      const currentIndex = board.variants.indexOf(variantId)
      if (currentIndex <= 1) {
        if (currentIndex === 1) {
          addToast("Variant is already at the top position")
        }
        return
      }

      moveVariant(variantId, currentIndex - 1)
    },
    [workspace, moveVariant, addToast],
  )

  const moveVariantDown = useCallback(
    (variantId: VariantId) => {
      const variant = workspaceService.getVariant(variantId, workspace)
      if (workspaceService.isDefaultVariant(variant)) {
        addToast("Default variant cannot be moved")
        return
      }

      const board = workspaceService.findBoardForVariant(variant, workspace)
      invariant(board, "Board not found")

      const currentIndex = board.variants.indexOf(variantId)
      if (currentIndex === -1 || currentIndex >= board.variants.length - 1) {
        if (currentIndex === board.variants.length - 1) {
          addToast("Variant is already at the bottom position")
        }
        return
      }

      moveVariant(variantId, currentIndex + 1)
    },
    [workspace, moveVariant, addToast],
  )

  const moveSelectionUp = useCallback(() => {
    if (!selection) return

    if (workspaceService.isBoard(selection)) {
      moveBoardUp(selection.id)
    } else {
      if (workspaceService.isInstance(selection)) {
        moveChildUp(selection.id)
      }
      if (workspaceService.isVariant(selection)) {
        moveVariantUp(selection.id)
      }
    }
  }, [selection, moveBoardUp, moveChildUp, moveVariantUp])

  const moveSelectionDown = useCallback(() => {
    if (!selection) return

    if (workspaceService.isBoard(selection)) {
      moveBoardDown(selection.id)
    } else {
      if (workspaceService.isInstance(selection)) {
        moveChildDown(selection.id)
      }
      if (workspaceService.isVariant(selection)) {
        moveVariantDown(selection.id)
      }
    }
  }, [selection, moveBoardDown, moveChildDown, moveVariantDown])

  return {
    moveSelectionDown,
    moveSelectionUp,
  }
}
