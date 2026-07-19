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
import {
  getBoardMoveIndex,
  getMoveCapabilities,
  getVariantMoveIndex,
  type MoveDirection,
} from "@seldon/editor/lib/commands/move-decisions"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"

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
      const newIndex = getBoardMoveIndex(order, count, direction)

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
      const newIndex = getVariantMoveIndex(currentIndex, lastIndex, direction)
      if (newIndex === null) return

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

  const can = useMemo(
    () => getMoveCapabilities(workspace, selection),
    [selection, workspace],
  )

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
