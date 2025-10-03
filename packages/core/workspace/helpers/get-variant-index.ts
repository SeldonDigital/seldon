import { VariantId, Workspace } from "../types"
import { getBoardById } from "./get-board-by-id"
import { getVariantById } from "./get-variant-by-id"

/**
 * Gets the index position of a variant within its board's variants array.
 * @param variantId - The ID of the variant node
 * @param workspace - The workspace containing the boards and variants
 * @returns The index of the variant in its board, or -1 if not found
 */
export function getVariantIndex(variantId: VariantId, workspace: Workspace) {
  const variant = getVariantById(variantId, workspace)
  const board = getBoardById(variant.component, workspace)
  return board.variants.indexOf(variantId)
}
