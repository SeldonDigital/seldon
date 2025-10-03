import { Variant, VariantId, Workspace, invariant } from "../../index"
import { ErrorMessages } from "../constants"
import { isVariantNode } from "./is-variant-node"

/**
 * Retrieves a variant node by its ID, ensuring it's not an instance.
 * @param targetId - The ID of the variant to retrieve
 * @param workspace - The workspace containing the nodes
 * @returns The variant node
 * @throws Error if the node is not found or is an instance instead of a variant
 */
export function getVariantById(
  targetId: VariantId,
  workspace: Workspace,
): Variant {
  const node = workspace.byId[targetId]
  invariant(node, ErrorMessages.variantNotFound(targetId))

  if (!isVariantNode(node)) {
    throw new Error(ErrorMessages.nodeNotVariant(targetId))
  }
  return node
}
