import type { Board } from "../../types"

/** Board fields other than the variant tree, for checks that should ignore variants. */
export type BoardMetadata = Omit<Board, "variants">

/**
 * Builds a plain object with every board field except variants.
 * Use this snapshot when you compare or hash board data without the variant tree.
 *
 * @param board Board to read.
 */
export function getBoardMetadata(board: Board): BoardMetadata {
  const { variants, ...metadata } = board
  void variants
  return metadata
}
