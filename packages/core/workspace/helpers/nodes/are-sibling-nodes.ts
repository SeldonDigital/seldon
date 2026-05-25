import { invariant } from "../../../index"
import { EntryNode, Workspace } from "../../types"
import { findParentNode } from "./find-parent-node"

/**
 * Check whether two nodes are siblings.
 *
 * @param node1 First node.
 * @param node2 Second node.
 * @param workspace Workspace that contains both nodes.
 * @returns True when both nodes have the same parent and different ids.
 */
export function areSiblingNodes(
  node1: EntryNode,
  node2: EntryNode,
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
