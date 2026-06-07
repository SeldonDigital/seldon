import type { Board } from "../../types"

/**
 * Reads this board's type field.
 * The value is always component, playground, theme, font-collection, icon-set, or media.
 *
 * @param board Board to read.
 */
export function getBoardType(board: Board): Board["type"] {
  return board.type
}
