import {
  Properties,
  PropertyKey,
  SubPropertyKey,
} from "../../../properties"
import { mergeProperties } from "../../../properties/helpers/merge-properties"
import { getWorkspaceNodes } from "../../helpers/general/get-workspace-nodes"
import { getNodeSubtreeIds } from "../../helpers/nodes/get-node-subtree-ids"
import { resolveNodePropertyResetPatch } from "../../helpers/nodes/resolve-node-property-reset"
import { isEntryNodeForRules } from "../../helpers/rules/rules-node-subject"
import { BoardKey, InstanceId, VariantId, Workspace } from "../../types"
import { nodeRetrievalService } from "../nodes/node-retrieval.service"
import { mutateWorkspace } from "../shared/workspace-mutation.helper"
import {
  withBoardMutation,
  withNodeMutation,
} from "../shared/workspace-operation-helpers"

interface PropertyResetTarget {
  propertyKey: PropertyKey
  subpropertyKey?: SubPropertyKey
}

/** Merges properties into a node's overrides. */
export function setNodeProperties(
  nodeId: VariantId | InstanceId,
  properties: Properties,
  workspace: Workspace,
  options?: { mergeSubProperties?: boolean },
): Workspace {
  return withNodeMutation(nodeId, workspace, (node) => {
    if (!isEntryNodeForRules(node)) return
    node.overrides = mergeProperties(node.overrides, properties, options)
  })
}

/** Resets one property (or sub-property facet) on a node to its default. */
export function resetNodeProperty(
  nodeId: VariantId | InstanceId,
  target: PropertyResetTarget,
  workspace: Workspace,
): Workspace {
  return resetObjectProperty(nodeId, target, workspace)
}

/**
 * Clears every override on a node and all descendants in its variant tree,
 * reverting the subtree to its template baseline.
 */
export function resetNodeOverrides(
  nodeId: VariantId | InstanceId,
  workspace: Workspace,
): Workspace {
  const subtreeIds = getNodeSubtreeIds(nodeId, workspace)
  return mutateWorkspace(workspace, (draft) => {
    const nodes = getWorkspaceNodes(draft)
    for (const id of subtreeIds) {
      const node = nodes[id]
      if (node && isEntryNodeForRules(node)) {
        node.overrides = {}
      }
    }
  })
}

/** Merges properties into a board's component properties. */
export function setComponentProperties(
  boardKey: BoardKey,
  properties: Properties,
  workspace: Workspace,
): Workspace {
  return withBoardMutation(boardKey, workspace, (board) => {
    board.componentProperties = mergeProperties(
      board.componentProperties,
      properties,
      { mergeSubProperties: true },
    )
  })
}

/** Resets one property (or sub-property facet) on a board to its default. */
export function resetComponentProperty(
  boardKey: BoardKey,
  target: PropertyResetTarget,
  workspace: Workspace,
): Workspace {
  return resetObjectProperty(boardKey, target, workspace)
}

/**
 * Resets a property on either a board (by key) or a node (by id). Boards delete
 * the override outright; nodes resolve a reset patch that may delete or restore
 * an inherited value.
 */
function resetObjectProperty(
  objectId: VariantId | InstanceId | BoardKey,
  { propertyKey, subpropertyKey }: PropertyResetTarget,
  workspace: Workspace,
): Workspace {
  return mutateWorkspace(workspace, (draft) => {
    const board = draft.boards[objectId as BoardKey]
    if (board) {
      if (subpropertyKey) {
        deleteSubProperty(board.componentProperties, propertyKey, subpropertyKey)
      } else {
        delete board.componentProperties[propertyKey]
      }
      return
    }

    const node = nodeRetrievalService.getNode(
      objectId as VariantId | InstanceId,
      draft,
    )
    if (!isEntryNodeForRules(node)) return

    const patch = resolveNodePropertyResetPatch(
      node,
      draft,
      propertyKey,
      subpropertyKey,
    )

    if (patch.action === "delete") {
      delete node.overrides[propertyKey]
      return
    }
    if (patch.action === "delete-sub" && subpropertyKey) {
      deleteSubProperty(node.overrides, propertyKey, subpropertyKey)
      return
    }
    if (patch.action === "set") {
      node.overrides = mergeProperties(node.overrides, patch.properties, {
        mergeSubProperties: true,
      })
    }
  })
}

/** Deletes one sub-property facet from a compound or layered-paint property bag. */
function deleteSubProperty(
  bag: Properties,
  propertyKey: PropertyKey,
  subpropertyKey: SubPropertyKey,
): void {
  const overrideBag = bag[propertyKey]
  if (Array.isArray(overrideBag) && overrideBag[0]) {
    delete (overrideBag[0] as Record<string, unknown>)[subpropertyKey]
  } else if (
    overrideBag &&
    typeof overrideBag === "object" &&
    !Array.isArray(overrideBag)
  ) {
    delete (overrideBag as Record<string, unknown>)[subpropertyKey]
  }
}
