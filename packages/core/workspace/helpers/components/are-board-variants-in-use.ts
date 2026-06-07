import type { Board, Workspace } from "../../types"
import { getBoardVariantRootIds } from "./get-board-variant-root-ids"
import { isVariantInUse } from "../general/is-variant-in-use"

/**
 * True when any root variant listed on this catalog row appears under another row's tree.
 */
export function areBoardVariantsInUse(
  board: Board,
  workspace: Workspace,
): boolean {
  for (const variantId of getBoardVariantRootIds(board)) {
    if (isVariantInUse(variantId, workspace)) return true
  }
  return false
}
