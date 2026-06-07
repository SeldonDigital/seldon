import type { Board } from "../../types"

/**
 * Get root variant ids from a board.
 *
 * @param board Board to read.
 * @returns Root variant ids from the board.
 */
export function getBoardVariantRootIds(board: Board): string[] {
  return board.variants.map((entry) => entry.id)
}
