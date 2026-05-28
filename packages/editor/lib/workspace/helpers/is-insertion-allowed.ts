import { Placement } from "@lib/types"
import {
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
} from "@seldon/core"
import { rules } from "@seldon/core/rules/config/rules.config"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"

/**
 * Checks if insertion is allowed for a given tool, object, and placement.
 *
 * For "component" tool:
 * - Prevents insertion into default variants
 * - Prevents insertion into any ancestor that is a default variant
 * - Checks rules.mutations.insertInto for variants
 *
 * For "sketch" tool:
 * - Prevents insertion into instances (sketch doesn't work on instances)
 * - Prevents insertion into default variants
 * - Prevents insertion into any ancestor that is a default variant (covers all nested children)
 *
 * @param objectId - The ID of the object being hovered/clicked
 * @param placement - The placement ("inside", "before", "after")
 * @param workspace - The workspace
 * @param tool - The active tool ("component" | "sketch")
 * @param node - Optional: The node object (if already retrieved, avoids duplicate lookup)
 * @returns true if insertion is allowed, false otherwise
 */
export function isInsertionAllowed(
  objectId: InstanceId | VariantId,
  placement: Placement,
  workspace: Workspace,
  tool: "component" | "sketch",
  node?: Variant | Instance,
): boolean {
  try {
    const targetNode = node ?? workspaceService.getNode(objectId, workspace)

    // Helper function to check if a node or any ancestor is a default variant
    // This automatically covers all nested children - if any ancestor is a default variant,
    // insertion is disabled for all descendants
    const checkNodeAndAncestors = (startNode: Variant | Instance): boolean => {
      let currentNode: Variant | Instance | null = startNode
      while (currentNode) {
        // Check if current node is a default variant
        if (
          workspaceService.isVariant(currentNode) &&
          workspaceService.isDefaultVariant(currentNode)
        ) {
          return false
        }

        // Walk up to parent to check ancestors
        const parent = workspaceService.findParentNode(
          currentNode.id,
          workspace,
        )
        if (!parent) break
        currentNode = parent
      }
      return true
    }

    // For sketch tool, don't allow insertion into instances or default variants
    if (tool === "sketch") {
      // Don't allow insertion into instances
      if (workspaceService.isInstance(targetNode)) {
        return false
      }

      // Determine the actual target node where insertion will happen
      let insertionTargetNode: Variant | Instance

      if (placement === "inside") {
        // For "inside" placement, find the container node
        try {
          insertionTargetNode = workspaceService.findContainerNode(
            objectId,
            workspace,
          )
        } catch {
          // If container not found, fall back to checking the node itself
          insertionTargetNode = targetNode
        }
      } else {
        // For "before"/"after" placement, the target is the parent
        const parentNode = workspaceService.findParentNode(objectId, workspace)
        if (!parentNode) {
          return true // No parent means it's a root variant, allow insertion
        }
        insertionTargetNode = parentNode
      }

      // Check the target node and all its ancestors for default variants
      if (!checkNodeAndAncestors(insertionTargetNode)) {
        return false
      }

      // Also check the original hovered node and its ancestors
      // This catches cases where we hover over child instances of default variants
      if (!checkNodeAndAncestors(targetNode)) {
        return false
      }

      return true
    }

    // For component tool, check default variants and rules
    if (tool === "component") {
      // Check rules for variants (component tool has additional rule checks)
      const checkRules = (node: Variant | Instance): boolean => {
        if (workspaceService.isVariant(node)) {
          const entityType = workspaceService.getEntityType(node)
          if (!rules.mutations.insertInto[entityType].allowed) {
            return false
          }
        }
        return true
      }

      // Determine the actual target node where insertion will happen
      let insertionTargetNode: Variant | Instance

      if (placement === "inside") {
        // For "inside" placement, find the container node (same logic as click handler)
        try {
          insertionTargetNode = workspaceService.findContainerNode(
            objectId,
            workspace,
          )
        } catch {
          // If container not found, fall back to checking the node itself
          insertionTargetNode = targetNode
        }
      } else {
        // For "before"/"after" placement, the target is the parent
        const parentNode = workspaceService.findParentNode(objectId, workspace)
        if (!parentNode) {
          return true // No parent means it's a root variant, allow insertion
        }
        insertionTargetNode = parentNode
      }

      // Check the target node and all its ancestors for default variants
      if (!checkNodeAndAncestors(insertionTargetNode)) {
        return false
      }

      // Also check the original hovered node and its ancestors
      // This catches cases where we hover over child instances of default variants
      if (!checkNodeAndAncestors(targetNode)) {
        return false
      }

      // Check rules for the target node
      if (!checkRules(insertionTargetNode)) {
        return false
      }

      return true
    }

    return true
  } catch {
    // If node doesn't exist, allow insertion (will be caught by validation)
    return true
  }
}
