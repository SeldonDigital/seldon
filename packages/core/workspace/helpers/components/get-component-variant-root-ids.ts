import type { ComponentEntry } from "../../types"

/**
 * Get root variant ids from a board.
 *
 * @param board ComponentEntry to read.
 * @returns Root variant ids from the board.
 */
export function getComponentVariantRootIds(board: ComponentEntry): string[] {
  return board.variants.map((entry) => entry.id)
}
