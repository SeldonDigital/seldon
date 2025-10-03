import { invariant } from "../../index"
import { InstanceId, Workspace } from "../types"
import { findParentNode } from "./find-parent-node"

/**
 * Check if a child is the only child of a parent
 *
 * @param childId - The child to check
 * @param workspace - The workspace
 */
export function isOnlyChild(childId: InstanceId, workspace: Workspace) {
  const parent = findParentNode(childId, workspace)
  invariant(parent, "Unable to find parent for child " + childId)

  return parent.children?.length === 1
}
