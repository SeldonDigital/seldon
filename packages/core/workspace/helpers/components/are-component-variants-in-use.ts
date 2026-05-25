import type { ComponentEntry, Workspace } from "../../types"
import { getComponentVariantRootIds } from "./get-component-variant-root-ids"
import { isVariantInUse } from "../general/is-variant-in-use"

/**
 * True when any root variant listed on this catalog row appears under another row's tree.
 */
export function areComponentVariantsInUse(
  board: ComponentEntry,
  workspace: Workspace,
): boolean {
  for (const variantId of getComponentVariantRootIds(board)) {
    if (isVariantInUse(variantId, workspace)) return true
  }
  return false
}
