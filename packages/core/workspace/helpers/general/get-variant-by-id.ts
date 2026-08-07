import { invariant } from "../../../helpers/utils/invariant"
import { ErrorMessages } from "../../constants"
import { isVariantNode } from "../nodes/is-variant-node"

import type { EntryNode, EntryNodeId, Workspace } from "../../types"

/**
 * Retrieves a variant node by its ID, ensuring it's not an instance.
 * @param targetId - The ID of the variant to retrieve
 * @param workspace - The workspace containing the nodes
 * @returns The variant node
 * @throws Error if the node is not found or is an instance instead of a variant
 */
export function getVariantById(
  targetId: EntryNodeId,
  workspace: Workspace,
): EntryNode & { type: "default" | "variant" } {
  const node = workspace.nodes[targetId]

  invariant(node, ErrorMessages.variantNotFound(targetId))

  if (!isVariantNode(node)) {
    throw new Error(ErrorMessages.nodeNotVariant(targetId))
  }

  return node
}
