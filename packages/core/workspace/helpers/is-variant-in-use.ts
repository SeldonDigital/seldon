import { VariantId, Workspace } from "../types"
import { findNodeByVariant } from "./find-node-by-variant"

/**
 * Check if a variant is in use (one or more boards are in use)
 *
 * @param variantId - The variant to check
 * @param workspace - The workspace
 */
export function isVariantInUse(variantId: VariantId, workspace: Workspace) {
  return Boolean(findNodeByVariant(variantId, workspace))
}
