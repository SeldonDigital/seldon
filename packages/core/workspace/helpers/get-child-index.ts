import { invariant } from "../../index"
import { InstanceId, Workspace } from "../types"
import { findParentNode } from "./find-parent-node"

/**
 * Get the index of a child in its parent
 * @param childId - The ID of the child node
 * @param workspace - The current workspace state
 * @returns The index of the child in its parent
 */
export function getChildIndex(childId: InstanceId, workspace: Workspace) {
  const parent = findParentNode(childId, workspace)
  invariant(parent, "Parent not found for " + childId)

  const index = parent.children!.indexOf(childId)
  invariant(index !== -1, "Unable to determine index for node " + childId)

  return index
}
