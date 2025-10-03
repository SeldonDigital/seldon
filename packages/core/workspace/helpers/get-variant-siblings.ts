import { VariantId, Workspace } from "../types"
import { getBoardById } from "./get-board-by-id"
import { getVariantById } from "./get-variant-by-id"

/**
 * Get the siblings of a variant
 *
 * @param variantId - The variant to get siblings for
 * @param workspace - The workspace
 */
export function getVariantSiblingIds(
  variantId: VariantId,
  workspace: Workspace,
): VariantId[] {
  const variant = getVariantById(variantId, workspace)
  const board = getBoardById(variant.component, workspace)

  return board.variants.filter((v) => v !== variantId)
}
