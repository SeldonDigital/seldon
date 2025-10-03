import { Instance, InstanceId, Variant } from "../types"

/**
 * Checks if a node can have children by verifying it has a children array.
 * @param node - The node to check
 * @returns True if the node has children, false otherwise
 */
export function canNodeHaveChildren(
  node: Variant | Instance | null,
): node is (Variant | Instance) & { children: InstanceId[] } {
  return !!node?.children
}
