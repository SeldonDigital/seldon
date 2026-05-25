import type { ComponentEntry } from "../../types"

const BOARD_ORDER_KEY = "order"

/**
 * Stable sort index for boards (stored in {@link ComponentEntry.__editor}, not the file spec).
 */
export function getComponentOrder(board: ComponentEntry): number {
  const v = board.__editor?.[BOARD_ORDER_KEY]
  return typeof v === "number" ? v : 0
}

export function setComponentOrder(board: ComponentEntry, order: number): void {
  board.__editor = { ...board.__editor, [BOARD_ORDER_KEY]: order }
}
