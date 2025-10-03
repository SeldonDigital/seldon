import { invariant } from "../../index"
import { Instance, Variant, Workspace } from "../types"
import { findParentNode } from "./find-parent-node"

/**
 * Check if two nodes are siblings.
 * If node1 and node2 are the same node, they are not siblings.
 * If node1 and node2 have the same parent, they are siblings.
 *
 * @param node1 - The first node
 * @param node2 - The second node
 * @param workspace - The workspace
 * @returns True if the nodes are siblings, false otherwise
 */
export function areSiblingNodes(
  node1: Variant | Instance,
  node2: Variant | Instance,
  workspace: Workspace,
) {
  if (node1.id === node2.id) {
    return false
  }

  const node1Parent = findParentNode(node1.id, workspace)
  invariant(node1Parent, "Parent not found for node " + node1.id)
  const node2Parent = findParentNode(node2.id, workspace)
  invariant(node2Parent, "Parent not found for node " + node2.id)

  return node1Parent.id === node2Parent.id
}
