import type { Board } from "../../types"

const BOARD_ORDER_KEY = "order"

/**
 * Stable sort index for boards (stored in {@link Board.__editor}, not the file spec).
 */
export function getBoardOrder(board: Board): number {
  const v = board.__editor?.[BOARD_ORDER_KEY]
  return typeof v === "number" ? v : 0
}

export function setBoardOrder(board: Board, order: number): void {
  board.__editor = { ...board.__editor, [BOARD_ORDER_KEY]: order }
}
