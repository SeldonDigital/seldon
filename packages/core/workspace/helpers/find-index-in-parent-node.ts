import { Instance, InstanceId, Variant } from "../../index"
import { canNodeHaveChildren } from "./can-node-have-children"

/**
 * Finds the index position of a child node within its parent's children array.
 * @param parent - The parent node to search within
 * @param childIdToCompare - The ID of the child node to find
 * @returns The index of the child, or -1 if not found or parent has no children
 */
export function findIndexInParentNode(
  parent: Variant | Instance | null,
  childIdToCompare: string,
) {
  if (parent && canNodeHaveChildren(parent)) {
    return parent.children.indexOf(childIdToCompare as InstanceId)
  }
  return -1
}
