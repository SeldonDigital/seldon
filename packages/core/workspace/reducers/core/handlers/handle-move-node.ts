import { rules } from "../../../../rules/config/rules.config"
import { workspaceService } from "../../../services/workspace.service"
import { ExtractPayload, Workspace } from "../../../types"
import {
  ValidationOptions,
  logValidationResult,
  validateCoreOperation,
} from "../helpers/validation"

/**
 * Moves a node to a new parent and index.
 *
 * Example: Moving a node within the workspace hierarchy
 *
 * BEFORE MOVE:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Original Structure:                                         │
 * │ • ButtonBar.Button                                          │
 * │ • ButtonBar.Frame                                           │
 * │                                                             │
 * │ Instance Structure:                                         │
 * │ • ProductCard.ButtonBar.Button                              │
 * │ • ProductCard.ButtonBar.Frame                               │
 * │ • TravelCard.ButtonBar.Button                               │
 * │ • TravelCard.ButtonBar.Frame                                │
 * └─────────────────────────────────────────────────────────────┘
 *
 * OPERATION:
 * Move ButtonBar.Button into ButtonBar.Frame at index 0
 *
 * AFTER MOVE:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Original Structure:                                         │
 * │ • ButtonBar.Frame.Button                                    │
 * │                                                             │
 * │ Instance Structure:                                         │
 * │ • ProductCard.ButtonBar.Frame.Button                        │
 * │ • TravelCard.ButtonBar.Frame.Button                         │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Note: The move operation propagates to all instances, maintaining
 * the hierarchical relationship across the entire workspace.
 *
 * @param payload Contains the child ID and new index
 * @param workspace Current workspace state
 * @returns Updated workspace with the child node moved
 */
export function handleMoveNode(
  payload: ExtractPayload<"move_node">,
  workspace: Workspace,
  options: ValidationOptions = {},
): Workspace {
  // Perform validation for AI operations or when explicitly requested
  if (options.isAiOperation || options.strict) {
    const validation = validateCoreOperation(
      "move_node",
      payload,
      workspace,
      options,
    )
    logValidationResult("move_node", validation, options)

    // For AI operations, we want to be more strict about validation failures
    if (options.isAiOperation && !validation.isValid) {
      // Continue execution but log the issues for AI debugging
    }
  }

  const subjectNodeId = payload.nodeId
  const targetNodeId = payload.target.parentId
  const index = payload.target.index ?? 0

  // The subject is the node that is being moved
  const subjectNode = workspaceService.getNode(subjectNodeId, workspace)

  // The target is the node that the subject is being moved into
  const targetNode = workspaceService.getNode(targetNodeId, workspace)

  const entityType = workspaceService.getEntityType(subjectNode)
  // Check if the subject node is allowed to be moved
  const { allowed, propagation } = rules.mutations.move[entityType]

  if (allowed) {
    const rootVariant = workspaceService.getRootVariant(subjectNode, workspace)

    // Construct paths to the subject and target nodes so we can
    // find their instances when we propagate the move operation
    const subjectNodePath = workspaceService.getNodePath(subjectNode, workspace)
    const targetNodePath = workspaceService.getNodePath(targetNode, workspace)

    return workspaceService.propagateNodeOperation<
      ReturnType<typeof workspaceService.moveNode>
    >({
      nodeId: rootVariant.id,
      propagation,
      apply: (node, workspace) => {
        // Find the instance of the subject node within the current operation's node
        const subjectNode = workspaceService.findNodeByPath(
          node,
          subjectNodePath,
          workspace,
        )

        // Find the instance of the target node within the current operation's node
        const targetNode = workspaceService.findNodeByPath(
          node,
          targetNodePath,
          workspace,
        )

        // If we found both the subject and the target, this means that this operation's node
        // structure matches the original structure, so we can propagate the move operation
        if (
          subjectNode &&
          workspaceService.isInstance(subjectNode) &&
          targetNode
        ) {
          return workspaceService.moveNode(
            subjectNode.id,
            { parentId: targetNode.id, index },
            workspace,
          )
        }

        return workspace
      },
      workspace,
    })
  }

  return workspace
}
