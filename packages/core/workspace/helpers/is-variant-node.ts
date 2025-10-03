import { Instance, Variant } from "../types"

/**
 * Type guard that checks if a node is a variant by looking for the absence of the variant property.
 * @param node - The node to check
 * @returns True if the node is a variant, false otherwise
 */
export function isVariantNode(
  node: Variant | Instance | undefined,
): node is Variant {
  return node !== undefined && !("variant" in node)
}
