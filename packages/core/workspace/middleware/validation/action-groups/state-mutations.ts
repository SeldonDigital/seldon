import { ValueType } from "../../../../properties"
import { rules } from "../../../../rules/config/rules.config"
import { isReservedStateName } from "../../../model/node-state"
import {
  nodeRetrievalService,
  typeCheckingService,
  workspaceMutationService,
} from "../../../services"
import type { Action, InstanceId, VariantId, Workspace } from "../../../types"
import { check } from "../check"
import { getNodeComponentId } from "../node-component-id"
import { nodeValidators, propertyValidators } from "../validators"

/**
 * Tells whether a state key is part of the workspace vocabulary: a reserved
 * interaction-state name or a registered custom state.
 */
function isKnownState(workspace: Workspace, state: string): boolean {
  if (isReservedStateName(state)) return true
  return Boolean(
    workspace.metadata.customStates?.some((entry) => entry.key === state),
  )
}

/** Rejects state authoring on an entity the rules block, such as an instance. */
function assertStateAuthoringAllowed(
  workspace: Workspace,
  nodeId: InstanceId | VariantId,
): void {
  const node = nodeRetrievalService.getNode(nodeId, workspace)
  const entityType = typeCheckingService.getEntityType(node)
  check(
    rules.mutations.setStateProperties[entityType].allowed,
    "Instances use component states. To make changes, select the original or source component and edit the state there.",
  )
}

/**
 * Validates per-node interaction-state writes and resets. Enforces the
 * variant-only authoring rule, a known state name, and exposed property keys.
 */
export function validateStateMutation(
  workspace: Workspace,
  action: Action,
): void {
  switch (action.type) {
    case "set_node_state_properties": {
      const nodeId = action.payload.nodeId as InstanceId | VariantId
      nodeValidators.exists(workspace, nodeId)
      assertStateAuthoringAllowed(workspace, nodeId)
      check(
        isKnownState(workspace, action.payload.state),
        `Unknown interaction state "${action.payload.state}"`,
      )
      const node = nodeRetrievalService.getNode(nodeId, workspace)
      const themeId = workspaceMutationService.getNodeTheme(node, workspace)
      propertyValidators.keys(
        action.payload.properties,
        getNodeComponentId(node, workspace),
      )
      propertyValidators.values(action.payload.properties, workspace, themeId)
      break
    }
    case "reset_node_state_property": {
      const nodeId = action.payload.nodeId as InstanceId | VariantId
      nodeValidators.exists(workspace, nodeId)
      assertStateAuthoringAllowed(workspace, nodeId)
      const node = nodeRetrievalService.getNode(nodeId, workspace)
      propertyValidators.keys(
        {
          [action.payload.propertyKey]: {
            type: ValueType.EMPTY,
            value: null,
          },
        },
        getNodeComponentId(node, workspace),
      )
      break
    }
    case "reset_node_state": {
      const nodeId = action.payload.nodeId as InstanceId | VariantId
      nodeValidators.exists(workspace, nodeId)
      assertStateAuthoringAllowed(workspace, nodeId)
      break
    }
  }
}

/**
 * Validates the workspace-wide custom-state registry actions. Keeps the
 * registry free of reserved names and duplicate keys, and requires a target
 * entry for renames.
 */
export function validateCustomStateRegistry(
  workspace: Workspace,
  action: Action,
): void {
  switch (action.type) {
    case "add_custom_state": {
      const key = action.payload.key
      check(key.length > 0, "Custom state key cannot be empty")
      check(
        !isReservedStateName(key),
        `"${key}" is a reserved interaction-state name`,
      )
      check(
        !workspace.metadata.customStates?.some((entry) => entry.key === key),
        `Custom state "${key}" already exists`,
      )
      break
    }
    case "rename_custom_state": {
      check(
        Boolean(
          workspace.metadata.customStates?.some(
            (entry) => entry.key === action.payload.key,
          ),
        ),
        `Custom state "${action.payload.key}" does not exist`,
      )
      break
    }
    case "remove_custom_state":
      break
  }
}
