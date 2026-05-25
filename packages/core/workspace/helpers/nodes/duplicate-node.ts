import { createNodeId } from "../../../helpers/utils/create-node-id"
import { EntryNode } from "../../types"

/**
 * Create a copy of a node with a new id.
 *
 * @param node Node to copy.
 * @returns Node copy with a new id.
 */
export function duplicateNode<T extends EntryNode>(node: T): T {
  return {
    ...node,
    id: createNodeId(),
  }
}
