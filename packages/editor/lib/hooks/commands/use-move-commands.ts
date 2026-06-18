import { useCallback, useMemo } from "react"
import { ComponentId } from "@seldon/core/components/constants"
import { VariantId, invariant } from "@seldon/core/index"
import { getBoardOrder } from "@seldon/core/workspace/helpers/components/board-sort-order"
import { getBoardVariantRootIds } from "@seldon/core/workspace/helpers/components/get-board-variant-root-ids"
import {
  nodeRelationshipService,
  nodeRetrievalService,
  typeCheckingService,
} from "@seldon/core/workspace/services"
import { canMoveInstance } from "@seldon/core/workspace/services/nodes/node-move-navigation.service"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"

type MoveDirection = "forward" | "backward" | "front" | "back"

/**
 * Commands for moving the current selection. Instances move through the core
 * `move_instance_directional` action, which crosses containers in reading order.
 * Boards and variants reorder within their own lists via the existing reducers.
 */
export function useMoveCommands() {
  const { selection } = useSelection()
  const { workspace, dispatch } = useWorkspace()
  const addToast = useAddToast()

  const moveBoard = useCallback(
    (boardId: ComponentId, direction: MoveDirection) => {
      const board = nodeRetrievalService.getBoard(boardId, workspace)
      const order = getBoardOrder(board)
      const count = Object.keys(workspace.boards).length

      const newIndex =
        direction === "forward"
          ? order - 1
          : direction === "backward"
            ? order + 2
            : direction === "front"
              ? 0
              : count

      dispatch({
        type: "reorder_board",
        payload: { boardKey: boardId, newIndex },
      })
    },
    [workspace, dispatch],
  )

  const moveVariant = useCallback(
    (variantId: VariantId, direction: MoveDirection) => {
      const variant = nodeRetrievalService.getVariant(variantId, workspace)
      if (typeCheckingService.isDefaultVariant(variant)) {
        addToast("Default variant cannot be moved")
        return
      }

      const board = nodeRelationshipService.findBoardForVariant(
        variant,
        workspace,
      )
      invariant(board, "Board not found")

      const variantRootIds = getBoardVariantRootIds(board)
      const currentIndex = variantRootIds.indexOf(variantId)
      const lastIndex = variantRootIds.length - 1

      // Index 0 is the default slot; user variants stay at 1 or later.
      const newIndex =
        direction === "forward"
          ? currentIndex - 1
          : direction === "backward"
            ? currentIndex + 1
            : direction === "front"
              ? 1
              : lastIndex

      if (newIndex < 1 || newIndex > lastIndex || newIndex === currentIndex) {
        return
      }

      dispatch({
        type: "reorder_variant_in_board",
        payload: {
          boardKey: getComponentKey(board),
          variantRootId: variantId,
          newIndex,
        },
      })
    },
    [workspace, dispatch, addToast],
  )

  const moveInstance = useCallback(
    (instanceId: string, direction: MoveDirection) => {
      dispatch({
        type: "move_instance_directional",
        payload: { instanceId, direction },
      })
    },
    [dispatch],
  )

  const move = useCallback(
    (direction: MoveDirection) => {
      if (!selection) return

      if (typeCheckingService.isBoard(selection)) {
        moveBoard(getComponentKey(selection) as ComponentId, direction)
      } else if (typeCheckingService.isInstance(selection)) {
        moveInstance(selection.id, direction)
      } else if (typeCheckingService.isVariant(selection)) {
        moveVariant(selection.id, direction)
      }
    },
    [selection, moveBoard, moveInstance, moveVariant],
  )

  const moveSelectionForward = useCallback(() => move("forward"), [move])
  const moveSelectionBackward = useCallback(() => move("backward"), [move])
  const moveSelectionToFront = useCallback(() => move("front"), [move])
  const moveSelectionToBack = useCallback(() => move("back"), [move])

  const can = useMemo(() => {
    const none = {
      forward: false,
      backward: false,
      front: false,
      back: false,
    }
    if (!selection) return none

    if (typeCheckingService.isBoard(selection)) {
      const order = getBoardOrder(selection)
      const count = Object.keys(workspace.boards).length
      const notFirst = order > 0
      const notLast = order < count - 1
      return {
        forward: notFirst,
        backward: notLast,
        front: notFirst,
        back: notLast,
      }
    }

    if (typeCheckingService.isInstance(selection)) {
      return {
        forward: canMoveInstance(workspace, selection.id, "forward"),
        backward: canMoveInstance(workspace, selection.id, "backward"),
        front: canMoveInstance(workspace, selection.id, "front"),
        back: canMoveInstance(workspace, selection.id, "back"),
      }
    }

    if (typeCheckingService.isVariant(selection)) {
      if (typeCheckingService.isDefaultVariant(selection)) return none
      const board = nodeRelationshipService.findBoardForVariant(
        selection,
        workspace,
      )
      if (!board) return none
      const variantRootIds = getBoardVariantRootIds(board)
      const index = variantRootIds.indexOf(selection.id)
      const notFirst = index > 1
      const notLast = index >= 1 && index < variantRootIds.length - 1
      return {
        forward: notFirst,
        backward: notLast,
        front: notFirst,
        back: notLast,
      }
    }

    return none
  }, [selection, workspace])

  return {
    moveSelectionForward,
    moveSelectionBackward,
    moveSelectionToFront,
    moveSelectionToBack,
    canMoveForward: can.forward,
    canMoveBackward: can.backward,
    canMoveToFront: can.front,
    canMoveToBack: can.back,
  }
}
