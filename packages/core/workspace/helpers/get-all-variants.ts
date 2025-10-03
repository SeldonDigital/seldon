import { Variant, Workspace } from "../types"
import { getVariantById } from "./get-variant-by-id"

/**
 * Retrieves all variant nodes from all boards in the workspace.
 * @param workspace - The workspace to extract variants from
 * @returns Array of all variant nodes
 */
export function getAllVariants(workspace: Workspace): Variant[] {
  return Object.values(workspace.boards).flatMap((board) =>
    board.variants.map((variantId) => getVariantById(variantId, workspace)),
  )
}
