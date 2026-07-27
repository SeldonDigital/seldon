import { type Workspace } from "@seldon/core"
import { getBoardOrder } from "@seldon/core/workspace/helpers/components/board-sort-order"
import { getBoardVariantRootIds } from "@seldon/core/workspace/helpers/components/get-board-variant-root-ids"
import type { Board } from "@seldon/core/workspace/model/components"
import type { EntryNode } from "@seldon/core/workspace/model/entry-node"
import {
  nodeRelationshipService,
  typeCheckingService,
} from "@seldon/core/workspace/services"
import { canMoveInstance } from "@seldon/core/workspace/services/nodes/node-move-navigation.service"

export type MoveDirection = "forward" | "backward" | "front" | "back"

export interface MoveCapabilities {
  forward: boolean
  backward: boolean
  front: boolean
  back: boolean
}

const NO_MOVE: MoveCapabilities = {
  forward: false,
  backward: false,
  front: false,
  back: false,
}

/**
 * Target index for reordering a board. Boards live in one flat list, so
 * `forward` steps toward index 0 and `backward` steps toward the end. `back`
 * uses the board count so the reducer clamps it to the last slot.
 */
export function getBoardMoveIndex(
  currentOrder: number,
  boardCount: number,
  direction: MoveDirection,
): number {
  switch (direction) {
    case "forward":
      return currentOrder - 1
    case "backward":
      return currentOrder + 2
    case "front":
      return 0
    case "back":
      return boardCount
  }
}

/**
 * Target index for reordering a user variant within its board, or `null` when
 * the move is a no-op. Index 0 is the default slot, so user variants stay at 1
 * or later.
 */
export function getVariantMoveIndex(
  currentIndex: number,
  lastIndex: number,
  direction: MoveDirection,
): number | null {
  const newIndex =
    direction === "forward"
      ? currentIndex - 1
      : direction === "backward"
        ? currentIndex + 1
        : direction === "front"
          ? 1
          : lastIndex

  if (newIndex < 1 || newIndex > lastIndex || newIndex === currentIndex) {
    return null
  }
  return newIndex
}

/**
 * Which move directions are available for the current selection. Boards and
 * user variants reorder within their own list; instances defer to the core
 * navigation service. The default variant and an empty selection cannot move.
 */
export function getMoveCapabilities(
  workspace: Workspace,
  selection: EntryNode | Board | null | undefined,
): MoveCapabilities {
  if (!selection) return NO_MOVE

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
    if (typeCheckingService.isDefaultVariant(selection)) return NO_MOVE
    const board = nodeRelationshipService.findBoardForVariant(
      selection,
      workspace,
    )
    if (!board) return NO_MOVE
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

  return NO_MOVE
}
