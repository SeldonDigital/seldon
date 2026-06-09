import { useCallback } from "react"
import { ComponentId } from "@seldon/core/components/constants"
import { InstanceId, VariantId, invariant } from "@seldon/core/index"
import { getBoardOrder } from "@seldon/core/workspace/helpers/components/board-sort-order"
import { getBoardVariantRootIds } from "@seldon/core/workspace/helpers/components/get-board-variant-root-ids"
import { findParentNode } from "@seldon/core/workspace/helpers/nodes/find-parent-node"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { getNodeChildIds } from "@lib/workspace/node-tree"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"

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
      const currentOrder = getBoardOrder(board)

      dispatch({
        type: "reorder_board",
        payload: {
          boardKey: boardId,
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
      const parent = findParentNode(nodeId, workspace)
      invariant(parent, "Parent not found")
      const childIds = getNodeChildIds(parent, workspace)
      invariant(childIds.length > 0, "Parent does not have children")

      const currentIndex = childIds.indexOf(nodeId)
      const isAtLimit =
        direction === "up"
          ? currentIndex <= 0
          : currentIndex === -1 || currentIndex >= childIds.length - 1

      if (isAtLimit) return

      dispatch({
        type: "reorder_instance_in_parent",
        payload: {
          instanceId: nodeId,
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
      const board = workspaceService.findBoardForVariant(variant, workspace)
      invariant(board, "Board not found")
      if (workspaceService.isDefaultVariant(variant) || index === 0) {
        addToast("Default variant cannot be moved or replaced")
        return
      }

      dispatch({
        type: "reorder_variant_in_board",
        payload: {
          boardKey: getComponentKey(board),
          variantRootId: variantId,
          newIndex: index,
        },
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

      const variantRootIds = getBoardVariantRootIds(board)
      const currentIndex = variantRootIds.indexOf(variantId)
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

      const variantRootIds = getBoardVariantRootIds(board)
      const currentIndex = variantRootIds.indexOf(variantId)
      if (currentIndex === -1 || currentIndex >= variantRootIds.length - 1) {
        if (currentIndex === variantRootIds.length - 1) {
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
      moveBoardUp(getComponentKey(selection) as ComponentId)
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
      moveBoardDown(getComponentKey(selection) as ComponentId)
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
