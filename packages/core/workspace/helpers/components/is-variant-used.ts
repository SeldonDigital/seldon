import type { Workspace } from "../../types"
import { getBoardVariantRootIds } from "./get-board-variant-root-ids"
import { isVariantInUse } from "../general/is-variant-in-use"

/**
 * Returns true when some root variant from any board appears as a child reference under some node in any board variant tree.
 *
 * @param workspace Workspace that holds the boards.
 */
export function isVariantUsed(workspace: Workspace): boolean {
  for (const board of Object.values(workspace.components)) {
    for (const variantId of getBoardVariantRootIds(board)) {
      if (isVariantInUse(variantId, workspace)) {
        return true
      }
    }
  }
  return false
}
