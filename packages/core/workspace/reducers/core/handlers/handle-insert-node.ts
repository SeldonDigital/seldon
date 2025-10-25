import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import { workspaceService } from "../../../services/workspace.service"
import {
  ValidationOptions,
  logValidationResult,
  validateCoreOperation,
} from "../helpers/validation"

/**
 * Insert a node into the tree.
 */
export function handleInsertNode(
  payload: ExtractPayload<"insert_node">,
  workspace: Workspace,
  options: ValidationOptions = {},
): Workspace {
  // Perform validation for AI operations or when explicitly requested
  if (options.isAiOperation || options.strict) {
    const validation = validateCoreOperation(
      "insert_node",
      payload,
      workspace,
      options,
    )
    logValidationResult("insert_node", validation, options)

    // For AI operations, we want to be more strict about validation failures
    if (options.isAiOperation && !validation.isValid) {
      // Continue execution but log the issues for AI debugging
    }
  }

  const nodeToInstantiate = workspaceService.getNode(payload.nodeId, workspace)

  // Check if the target is allowed to receive the variant
  const targetNode = workspaceService.getNode(
    payload.target.parentId,
    workspace,
  )
  const targetEntityType = workspaceService.getEntityType(targetNode)
  if (!rules.mutations.insertInto[targetEntityType].allowed) return workspace

  // Check if the node is allowed to be instantiated
  const entityType = workspaceService.getEntityType(nodeToInstantiate)
  const { allowed, propagation } = rules.mutations.instantiate[entityType]
  if (!allowed) return workspace

  return workspaceService.propagateNodeOperation<
    ReturnType<typeof workspaceService.insertNode>
  >({
    nodeId: payload.target.parentId,
    propagation,
    apply: (node, workspace, sourceResult) => {
      /**
       * 1. First we instantiate the supplied node into the target node.
       * 2. If that target has instances, we need to recursively instantiate the instance created in step 1.
       *
       * For example:
       * - Button.Icon is an instance of Icon
       * - ButtonBar.Button#1.Icon is an instance of Button.Icon
       * - ProductCard.ButtonBar.Button#1.Icon is an instance of ButtonBar.Button#1.Icon
       */

      return workspaceService.insertNode(
        {
          nodeId: sourceResult ? sourceResult.createdNodeId : payload.nodeId,
          parentId: node.id,
          parentIndex: payload.target.index,
        },
        workspace,
      )
    },
    workspace,
  })
}
