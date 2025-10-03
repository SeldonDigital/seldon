import { Board, Workspace } from "../types"
import { isVariantInUse } from "./is-variant-in-use"

/**
 * Check if a board is in use (one or more variants are in use)
 *
 * @param board - The board to check
 * @param workspace - The workspace
 * @returns True if the board is in use, false otherwise
 */
export function areBoardVariantsInUse(board: Board, workspace: Workspace) {
  return Object.values(board.variants).some((variantId) =>
    isVariantInUse(variantId, workspace),
  )
}
