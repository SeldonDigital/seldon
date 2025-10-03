import { createNodeId } from "../../helpers/utils/create-node-id"
import { Instance, Variant } from "../../index"

/**
 * Creates a duplicate of a node with a new ID, preserving all other properties.
 * @param node - The node to duplicate
 * @returns A new node with the same properties but a different ID
 */
export function duplicateNode<T extends Variant | Instance>(node: T): T {
  return {
    ...node,
    id: createNodeId(),
  }
}
