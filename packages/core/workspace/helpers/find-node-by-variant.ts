import { Instance, Variant, VariantId, Workspace } from "../../index"
import { canNodeHaveChildren } from "./can-node-have-children"
import { getAllVariants } from "./get-all-variants"
import { getNodeById } from "./get-node-by-id"

/**
 * Searches for an instance node that uses the specified variant ID.
 * @param variantId - The variant ID to search for
 * @param workspace - The workspace to search within
 * @returns The first instance found using the variant, or null if none found
 */
export function findNodeByVariant(
  variantId: VariantId,
  workspace: Workspace,
): Instance | null {
  const allVariants = getAllVariants(workspace)

  for (const variant of allVariants) {
    const found = findNodeByVariantInNode(variant, variantId, workspace)
    if (found) return found
  }

  return null
}

/**
 * Recursively searches for an instance node using the specified variant ID within a node tree.
 * @param node - The node to search within
 * @param variantId - The variant ID to search for
 * @param workspace - The workspace containing the nodes
 * @returns The first instance found using the variant, or null if none found
 */
export function findNodeByVariantInNode(
  node: Variant | Instance,
  variantId: VariantId,
  workspace: Workspace,
): Instance | null {
  if (node && "variant" in node && node.variant === variantId) {
    return node
  }

  if (canNodeHaveChildren(node)) {
    for (const child of node.children) {
      const childNode = getNodeById(child, workspace)
      const found = findNodeByVariantInNode(childNode, variantId, workspace)
      if (found) return found
    }
  }
  return null
}
