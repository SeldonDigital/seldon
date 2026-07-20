import { useToastStore } from "@app/toaster/toast-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import { useSelection } from "@app/workspace/use-selection"
import { useWorkspace } from "@app/workspace/use-workspace"
import {
  type MoveDirection,
  getBoardMoveIndex,
  getMoveCapabilities,
  getVariantMoveIndex,
} from "@seldon/editor/lib/commands/move-decisions"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { computed } from "vue"

import { VariantId, invariant } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import { getBoardOrder } from "@seldon/core/workspace/helpers/components/board-sort-order"
import { getBoardVariantRootIds } from "@seldon/core/workspace/helpers/components/get-board-variant-root-ids"
import {
  nodeRelationshipService,
  nodeRetrievalService,
  typeCheckingService,
} from "@seldon/core/workspace/services"

/**
 * Commands for moving the current selection. Instances move through the core
 * `move_instance_directional` action, which crosses containers in reading order.
 * Boards and variants reorder within their own lists via the existing reducers.
 * Mirrors the React `useMoveCommands`.
 */
export function useMoveCommands() {
  const { selectedItem } = useSelection()
  const { workspace } = useWorkspace()
  const dispatch = useDispatch()
  const toast = useToastStore()

  function moveBoard(boardId: ComponentId, direction: MoveDirection): void {
    const ws = workspace.value
    const board = nodeRetrievalService.getBoard(boardId, ws)
    const order = getBoardOrder(board)
    const count = Object.keys(ws.boards).length
    const newIndex = getBoardMoveIndex(order, count, direction)

    dispatch({
      type: "reorder_board",
      payload: { boardKey: boardId, newIndex },
    })
  }

  function moveVariant(variantId: VariantId, direction: MoveDirection): void {
    const ws = workspace.value
    const variant = nodeRetrievalService.getVariant(variantId, ws)
    if (typeCheckingService.isDefaultVariant(variant)) {
      toast.addToast("Default variant cannot be moved")
      return
    }

    const board = nodeRelationshipService.findBoardForVariant(variant, ws)
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
  }

  function moveInstance(instanceId: string, direction: MoveDirection): void {
    dispatch({
      type: "move_instance_directional",
      payload: { instanceId, direction },
    })
  }

  function move(direction: MoveDirection): void {
    const selection = selectedItem.value
    if (!selection) return
    if (typeCheckingService.isBoard(selection)) {
      moveBoard(getComponentKey(selection) as ComponentId, direction)
    } else if (typeCheckingService.isInstance(selection)) {
      moveInstance(selection.id, direction)
    } else if (typeCheckingService.isVariant(selection)) {
      moveVariant(selection.id, direction)
    }
  }

  const can = computed(() =>
    getMoveCapabilities(workspace.value, selectedItem.value),
  )

  return {
    moveSelectionForward: () => move("forward"),
    moveSelectionBackward: () => move("backward"),
    moveSelectionToFront: () => move("front"),
    moveSelectionToBack: () => move("back"),
    canMoveForward: computed(() => can.value.forward),
    canMoveBackward: computed(() => can.value.backward),
    canMoveToFront: computed(() => can.value.front),
    canMoveToBack: computed(() => can.value.back),
  }
}
