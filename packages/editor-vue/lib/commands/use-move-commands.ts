import { computed } from "vue"
import { ComponentId } from "@seldon/core/components/constants"
import { VariantId, invariant } from "@seldon/core"
import { getBoardOrder } from "@seldon/core/workspace/helpers/components/board-sort-order"
import { getBoardVariantRootIds } from "@seldon/core/workspace/helpers/components/get-board-variant-root-ids"
import {
  nodeRelationshipService,
  nodeRetrievalService,
  typeCheckingService,
} from "@seldon/core/workspace/services"
import { canMoveInstance } from "@seldon/core/workspace/services/nodes/node-move-navigation.service"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { useToastStore } from "@lib/stores/toast-store"
import { useDispatch } from "@lib/workspace/use-dispatch"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"

type MoveDirection = "forward" | "backward" | "front" | "back"

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

  const can = computed(() => {
    const none = { forward: false, backward: false, front: false, back: false }
    const selection = selectedItem.value
    const ws = workspace.value
    if (!selection) return none

    if (typeCheckingService.isBoard(selection)) {
      const order = getBoardOrder(selection)
      const count = Object.keys(ws.boards).length
      const notFirst = order > 0
      const notLast = order < count - 1
      return { forward: notFirst, backward: notLast, front: notFirst, back: notLast }
    }

    if (typeCheckingService.isInstance(selection)) {
      return {
        forward: canMoveInstance(ws, selection.id, "forward"),
        backward: canMoveInstance(ws, selection.id, "backward"),
        front: canMoveInstance(ws, selection.id, "front"),
        back: canMoveInstance(ws, selection.id, "back"),
      }
    }

    if (typeCheckingService.isVariant(selection)) {
      if (typeCheckingService.isDefaultVariant(selection)) return none
      const board = nodeRelationshipService.findBoardForVariant(selection, ws)
      if (!board) return none
      const variantRootIds = getBoardVariantRootIds(board)
      const index = variantRootIds.indexOf(selection.id)
      const notFirst = index > 1
      const notLast = index >= 1 && index < variantRootIds.length - 1
      return { forward: notFirst, backward: notLast, front: notFirst, back: notLast }
    }

    return none
  })

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
