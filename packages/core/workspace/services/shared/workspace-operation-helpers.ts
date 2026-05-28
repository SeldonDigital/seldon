import { invariant } from "../../../index"
import { ErrorMessages } from "../../constants"
import {
  ComponentEntry,
  ComponentKey,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
} from "../../types"
import { nodeRelationshipService } from "../nodes/node-relationship.service"
import { nodeRetrievalService } from "../nodes/node-retrieval.service"
import { nodeTraversalService } from "../nodes/node-traversal.service"
import { mutateWorkspace } from "./workspace-mutation.helper"

/**
 * Helper functions for common workspace operation patterns to reduce code duplication.
 */

/**
 * Executes a mutation operation on a node with automatic retrieval and validation.
 * @param nodeId - The node ID to operate on
 * @param workspace - The workspace
 * @param operation - The operation to perform on the node
 * @returns The updated workspace
 */
export function withNodeMutation(
  nodeId: InstanceId | VariantId,
  workspace: Workspace,
  operation: (node: Variant | Instance, draft: Workspace) => void,
): Workspace {
  return mutateWorkspace(workspace, (draft) => {
    const node = nodeRetrievalService.getNode(nodeId, draft)
    invariant(node, ErrorMessages.nodeNotFound(nodeId))
    operation(node, draft)
  })
}

/**
 * Executes a mutation operation on a board with automatic retrieval and validation.
 * @param componentKey - Key of the board in `workspace.components`
 * @param workspace - The workspace
 * @param operation - The operation to perform on the board
 * @returns The updated workspace
 */
export function withComponentMutation(
  componentKey: ComponentKey,
  workspace: Workspace,
  operation: (board: ComponentEntry, draft: Workspace) => void,
): Workspace {
  return mutateWorkspace(workspace, (draft) => {
    const board = nodeRetrievalService.getComponent(componentKey, draft)
    operation(board, draft)
  })
}

/**
 * Finds a parent node with automatic validation and error handling.
 * @param child - The child node or node ID
 * @param workspace - The workspace
 * @param operation - Optional operation to perform on the parent
 * @returns The parent node (and optionally the result of the operation)
 */
export function withParentNode<T = void>(
  child: Variant | Instance | VariantId | InstanceId,
  workspace: Workspace,
  operation?: (parent: Variant | Instance) => T,
): T extends void
  ? Variant | Instance
  : { parent: Variant | Instance; result: T } {
  const parent = nodeTraversalService.findParentNode(child, workspace)
  invariant(
    parent,
    ErrorMessages.parentNotFound(typeof child === "string" ? child : child.id),
  )

  if (operation) {
    const result = operation(parent)
    return { parent, result } as any
  }

  return parent as any
}

/**
 * Executes an operation on a variant and its board with automatic validation.
 * @param variantId - The variant ID to operate on
 * @param workspace - The workspace
 * @param operation - The operation to perform on both variant and board
 * @returns The updated workspace
 */
export function withVariantAndComponentMutation(
  variantId: VariantId,
  workspace: Workspace,
  operation: (variant: Variant, board: ComponentEntry, draft: Workspace) => void,
): Workspace {
  return mutateWorkspace(workspace, (draft) => {
    const variant = nodeRetrievalService.getVariant(variantId, draft)
    const board = nodeRelationshipService.findComponentForVariant(variant, draft)
    invariant(board, ErrorMessages.componentNotFoundForVariant(variantId))
    operation(variant, board, draft)
  })
}

/**
 * Executes an operation on an instance and its parent with automatic validation.
 * @param instanceId - The instance ID to operate on
 * @param workspace - The workspace
 * @param operation - The operation to perform on both instance and parent
 * @returns The updated workspace
 */
export function withInstanceAndParentMutation(
  instanceId: InstanceId,
  workspace: Workspace,
  operation: (
    instance: Instance,
    parent: Variant | Instance,
    draft: Workspace,
  ) => void,
): Workspace {
  return mutateWorkspace(workspace, (draft) => {
    const instance = nodeRetrievalService.getInstance(instanceId, draft)
    const parent = nodeTraversalService.findParentNode(instance, draft)
    invariant(parent, ErrorMessages.parentNotFound(instanceId))
    operation(instance, parent, draft)
  })
}
