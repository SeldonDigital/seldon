import { invariant } from "../../index"
import { CoreAction } from "../reducers/core/types"
import { workspaceService } from "../services/workspace.service"
import {
  Action,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
} from "../types"
import { findParentNode } from "./find-parent-node"
import { getBoardById } from "./get-board-by-id"
import { getNodeById } from "./get-node-by-id"

/**
 * Determines the ID of the node that was added by a workspace action.
 * @param action - The action that was performed
 * @param workspace - The workspace after the action
 * @returns The ID of the node that was added
 */
export function getNodeIdAddedByAction(
  action: Action | CoreAction,
  workspace: Workspace,
): VariantId | InstanceId {
  const { type, payload } = action
  switch (type) {
    case "ai_insert_node":
    case "insert_node": {
      const parentNode = getNodeById(
        payload.target.parentId as VariantId | InstanceId,
        workspace,
      )
      invariant(
        parentNode?.children,
        `Node ${payload.target.parentId} can't have children`,
      )
      if (typeof payload.target.index === "number") {
        return parentNode.children[payload.target.index]
      } else {
        return parentNode.children[parentNode.children.length - 1]
      }
    }

    case "ai_add_component":
    case "ai_add_variant":
    case "add_board":
    case "add_variant": {
      const board = getBoardById(payload.componentId, workspace)
      const lastVariant = board.variants.at(-1)
      if (!lastVariant) {
        throw new Error(
          `No variants found in board ${payload.componentId}. Expected at least one variant after creation.`,
        )
      }
      return lastVariant
    }

    case "add_board_and_insert_default_variant": {
      const parentNode = getNodeById(
        payload.target.parentId as VariantId | InstanceId,
        workspace,
      )
      invariant(
        parentNode?.children,
        `Node ${payload.target.parentId} can't have children`,
      )
      if (typeof payload.target.index === "number") {
        return parentNode.children[payload.target.index]
      } else {
        return parentNode.children[parentNode.children.length - 1]
      }
    }

    case "ai_duplicate_node":
    case "duplicate_node": {
      const node = getNodeById(
        payload.nodeId as VariantId | InstanceId,
        workspace,
      )
      if (workspaceService.isVariant(node)) {
        const variant = node as Variant
        if (workspaceService.isDefaultVariant(variant)) {
          const board = getBoardById(variant.component, workspace)
          return board.variants.at(-1)!
        }

        const indexOfVariant = workspaceService.getVariantIndex(
          variant,
          workspace,
        )
        const indexOfDuplicate = indexOfVariant + 1
        const board = getBoardById(variant.component, workspace)
        return board.variants[indexOfDuplicate]
      }

      const indexOfInstance = workspaceService.getInstanceIndex(node, workspace)
      const indexOfDuplicate = indexOfInstance + 1
      const parentNode = findParentNode(node.id, workspace)
      invariant(parentNode, `Parent of ${node.id} not found`)
      invariant(
        parentNode.children,
        `Parent of ${node.id} does not have children`,
      )

      const instanceId = parentNode.children[indexOfDuplicate]
      invariant(instanceId, `No node id found at index ${indexOfDuplicate}`)

      return instanceId
    }
    default:
      throw new Error(
        `Action type ${action.type} does not create a new node so there is no node id to return`,
      )
  }
}
