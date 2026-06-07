import { invariant } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  isComponentBoard,
  isPlaygroundBoard,
} from "../../../model/components"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { getBoardVariantRootIds } from "../../../helpers/components/get-board-variant-root-ids"
import { findBoardContainingTreeNodeId } from "../../../helpers/nodes/duplicate-entry-variant-subtree"
import { hasEffectiveThemeReference } from "../../../helpers/removal/effective-theme-references"
import { isUserVariant } from "../../../helpers/general/is-user-variant"
import { ErrorMessages } from "../../../constants"
import {
  nodeRetrievalService,
  nodeTraversalService,
  workspaceMutationService,
  typeCheckingService,
} from "../../../services"
import { check } from "../check"
import { getNodeComponentId } from "../node-component-id"
import {
  assertInsertTargetAllowed,
  assertMoveTargetAllowed,
  componentValidators,
  nodeValidators,
  propertyValidators,
  themeEntryValidators,
  themeValidators,
  variantValidators,
} from "../validators"
import { WorkspaceValidationError } from "../workspace-validation-error"
import type {
  Action,
  InstanceId,
  VariantId,
  Workspace,
} from "../../../types"
import { ValueType } from "../../../../properties"
import type { ComponentId } from "../../../../components/constants"

export function validateInsertMutation(
  workspace: Workspace,
  action: Action,
): void {
  switch (action.type) {
    case "add_component_and_insert_default_instance": {
      const componentId = action.payload.boardKey
      const parentId = action.payload.target.parentId as InstanceId | VariantId
      componentValidators.doesNotExist(workspace, componentId)
      nodeValidators.exists(workspace, parentId)
      nodeValidators.canHaveChildren(workspace, parentId)
      nodeValidators.isNotInstanceOfSelf(
        workspace,
        componentId as ComponentId,
        parentId,
      )
      const parent = nodeRetrievalService.getNode(parentId, workspace)
      assertInsertTargetAllowed(parent, action)
      break
    }
    case "insert_variant_instance": {
      const nodeId = action.payload.variantId as VariantId
      const parentId = action.payload.target.parentId as InstanceId | VariantId
      validateInsertSource(
        workspace,
        action,
        nodeId,
        parentId,
        "variant",
      )
      break
    }
    case "insert_duplicate_instance": {
      const nodeId = action.payload.instanceId as InstanceId
      const parentId = action.payload.target.parentId as InstanceId | VariantId
      validateInsertSource(
        workspace,
        action,
        nodeId,
        parentId,
        "instance",
      )
      break
    }
    case "insert_default_instance": {
      const parentId = action.payload.parentId as InstanceId | VariantId
      const boardKey = action.payload.boardKey
      nodeValidators.exists(workspace, parentId)
      nodeValidators.canHaveChildren(workspace, parentId)
      componentValidators.exists(workspace, boardKey)
      const defaultVariant = nodeRetrievalService.getDefaultVariant(
        boardKey as ComponentId,
        workspace,
      )
      nodeValidators.isNotInstanceOfSelf(
        workspace,
        defaultVariant.id,
        parentId,
      )
      nodeValidators.canBeParentOf(workspace, parentId, defaultVariant.id)
      const parent = nodeRetrievalService.getNode(parentId, workspace)
      assertInsertTargetAllowed(parent, action)
      break
    }
    case "move_instance": {
      const instanceId = action.payload.instanceId as InstanceId
      const parentId = action.payload.target.parentId as InstanceId | VariantId
      nodeValidators.exists(workspace, instanceId)
      nodeValidators.exists(workspace, parentId)
      const instance = nodeRetrievalService.getNode(instanceId, workspace)
      const parent = nodeRetrievalService.getNode(parentId, workspace)
      if (!typeCheckingService.isInstance(instance)) {
        throw new WorkspaceValidationError(
          ErrorMessages.nodeNotInstance(instanceId),
          action,
        )
      }
      assertMoveTargetAllowed(
        parent,
        "Cannot move an instance into a default catalog variant",
      )
      nodeValidators.canHaveChildren(workspace, parentId)
      nodeValidators.isNotInstanceOfSelf(workspace, instanceId, parentId)
      nodeValidators.notIntoOwnSubtree(workspace, instanceId, parentId)
      nodeValidators.isWithinSameVariant(workspace, instanceId, parentId)
      nodeValidators.canBeParentOf(workspace, parentId, instanceId)
      break
    }
  }
}

function validateInsertSource(
  workspace: Workspace,
  action: Action,
  sourceId: VariantId | InstanceId,
  parentId: InstanceId | VariantId,
  expected: "variant" | "instance",
): void {
  nodeValidators.exists(workspace, sourceId)
  nodeValidators.exists(workspace, parentId)
  nodeValidators.canHaveChildren(workspace, parentId)
  nodeValidators.isNotInstanceOfSelf(workspace, sourceId, parentId)
  nodeValidators.canBeParentOf(workspace, parentId, sourceId)
  const sourceNode = nodeRetrievalService.getNode(sourceId, workspace)
  if (expected === "variant") {
    check(
      typeCheckingService.isVariant(sourceNode),
      "insert_variant_instance source must be a variant",
    )
  } else {
    check(
      typeCheckingService.isInstance(sourceNode),
      "insert_duplicate_instance source must be an instance",
    )
  }
  const parent = nodeRetrievalService.getNode(parentId, workspace)
  assertInsertTargetAllowed(parent, action)
}

export function validateNodeMutation(
  workspace: Workspace,
  action: Action,
): void {
  switch (action.type) {
    case "reorder_instance_in_parent": {
      const nodeId = action.payload.instanceId as InstanceId
      const index = action.payload.newIndex
      nodeValidators.exists(workspace, nodeId)
      const node = nodeRetrievalService.getNode(nodeId, workspace)
      if (!typeCheckingService.isInstance(node)) {
        throw new WorkspaceValidationError(
          ErrorMessages.nodeNotInstance(nodeId),
          action,
        )
      }
      const parent = nodeTraversalService.findParentNode(node, workspace)
      check(parent, ErrorMessages.parentNotFound(nodeId))
      check(
        !typeCheckingService.isDefaultVariant(parent),
        "Cannot reorder instances in a default catalog variant",
      )
      nodeValidators.moveAllowed(workspace, nodeId)
      variantValidators.notToDefaultPosition(workspace, nodeId, index)
      break
    }
    case "remove_instance": {
      const nodeId = action.payload.instanceId as InstanceId
      nodeValidators.canBeRemoved(workspace, nodeId)
      nodeValidators.exists(workspace, nodeId)
      const node = nodeRetrievalService.getNode(nodeId, workspace)
      if (!typeCheckingService.isInstance(node)) {
        throw new WorkspaceValidationError(
          ErrorMessages.nodeNotInstance(nodeId),
          action,
        )
      }
      const parent = nodeTraversalService.findParentNode(node, workspace)
      check(parent, ErrorMessages.parentNotFound(nodeId))
      check(
        !typeCheckingService.isDefaultVariant(parent),
        "Cannot remove an instance from a default catalog variant",
      )
      break
    }
    case "remove_variant": {
      const nodeId = action.payload.variantRootId as VariantId
      nodeValidators.canBeRemoved(workspace, nodeId)
      nodeValidators.exists(workspace, nodeId)
      const node = nodeRetrievalService.getNode(nodeId, workspace)
      check(
        typeCheckingService.isVariant(node),
        "remove_variant target must be a variant",
      )
      check(
        !typeCheckingService.isDefaultVariant(node),
        "Cannot remove a default catalog variant",
      )
      break
    }
    case "set_node_properties": {
      const nodeId = action.payload.nodeId as InstanceId | VariantId
      nodeValidators.exists(workspace, nodeId)
      const node = nodeRetrievalService.getNode(nodeId, workspace)
      const themeId = workspaceMutationService.getInheritedTheme(node, workspace)
      propertyValidators.keys(
        action.payload.properties,
        getNodeComponentId(node, workspace),
      )
      propertyValidators.values(
        action.payload.properties,
        workspace,
        themeId,
      )
      break
    }
    case "reset_node_property": {
      const nodeId = action.payload.nodeId as InstanceId | VariantId
      nodeValidators.exists(workspace, nodeId)
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
    case "set_node_theme": {
      const nodeId = action.payload.nodeId as InstanceId | VariantId
      nodeValidators.exists(workspace, nodeId)
      themeValidators.exists(workspace, action.payload.theme)
      break
    }
    case "set_node_label": {
      const nodeId = action.payload.nodeId as InstanceId | VariantId
      nodeValidators.exists(workspace, nodeId)
      variantValidators.labelIsUnique(workspace, {
        nodeId,
        label: action.payload.label,
      })
      break
    }
    case "set_node_editor_data":
    case "reset_node_label":
    case "reset_node_editor_data":
    case "reset_node":
      nodeValidators.exists(workspace, action.payload.nodeId)
      break
    case "reset_user_variant_to_default": {
      const variantRootId = action.payload.variantRootId as VariantId
      nodeValidators.exists(workspace, variantRootId)
      const node = nodeRetrievalService.getNode(variantRootId, workspace)
      check(
        isUserVariant(node),
        "Only a user variant can reset to the default variant tree",
      )
      const located = findBoardContainingTreeNodeId(
        workspace,
        variantRootId,
      )
      check(
        located &&
          (isComponentBoard(located.board) ||
            isPlaygroundBoard(located.board)),
        "That reset only runs on component or playground boards",
      )
      const idx = located!.board.variants.findIndex(
        (v) => v.id === variantRootId,
      )
      check(idx > 0, "The catalog default variant does not use this action")
      break
    }
    case "reset_default_variant_to_catalog": {
      const rootId = action.payload.defaultVariantRootId as VariantId
      nodeValidators.exists(workspace, rootId)
      const node = nodeRetrievalService.getNode(rootId, workspace)
      check(
        typeCheckingService.isDefaultVariant(node),
        "Only a default catalog variant can reset to catalog",
      )
      const located = findBoardContainingTreeNodeId(workspace, rootId)
      check(
        located &&
          (isComponentBoard(located.board) ||
            isPlaygroundBoard(located.board)),
        "That reset only runs on component or playground boards",
      )
      const idx = located!.board.variants.findIndex((v) => v.id === rootId)
      check(idx === 0, "Reset to catalog only runs on the default variant")
      break
    }
  }
}

export function validateAddVariant(
  workspace: Workspace,
  action: Extract<Action, { type: "add_variant" }>,
): void {
  componentValidators.exists(workspace, action.payload.boardKey)
  const board = workspace.components[action.payload.boardKey]
  check(
    board && (isComponentBoard(board) || isPlaygroundBoard(board)),
    "add_variant requires a component or playground board",
  )
}

export function validateDuplicateNode(
  workspace: Workspace,
  action: Extract<Action, { type: "duplicate_node" }>,
): void {
  nodeValidators.exists(workspace, action.payload.nodeId)
  const node = nodeRetrievalService.getNode(action.payload.nodeId, workspace)
  const entity = typeCheckingService.getEntityType(node)
  check(
    rules.mutations.duplicate[entity].allowed,
    `Cannot duplicate node of entity type ${entity}`,
  )
  if (typeCheckingService.isInstance(node)) {
    const parent = nodeTraversalService.findParentNode(node, workspace)
    check(
      !parent || !typeCheckingService.isDefaultVariant(parent),
      "Cannot duplicate an instance in a default catalog variant",
    )
  }
}

export function validateReorderBoard(
  workspace: Workspace,
  action: Extract<Action, { type: "reorder_board" }>,
): void {
  componentValidators.exists(workspace, action.payload.boardKey)
}

export function validateReorderVariantInBoard(
  workspace: Workspace,
  action: Extract<Action, { type: "reorder_variant_in_board" }>,
): void {
  componentValidators.exists(workspace, action.payload.boardKey)
  const board = workspace.components[action.payload.boardKey]
  check(Boolean(board), "Component board missing after exists check")
  const roots = getBoardVariantRootIds(board!)
  const oldIndex = roots.indexOf(action.payload.variantRootId)
  check(oldIndex >= 0, "Variant is not in the board variant list")
  if (oldIndex === 0 || action.payload.newIndex === 0) {
    check(
      oldIndex === 0 && action.payload.newIndex === 0,
      "Cannot move the default variant from index 0",
    )
  }
}

export function validateThemeMutation(
  workspace: Workspace,
  action: Action,
): void {
  switch (action.type) {
    case "reset_theme_tokens":
    case "reset_theme_label":
    case "reset_theme_editor_data":
    case "reset_theme_override":
    case "set_theme_label":
    case "set_theme_editor_data":
    case "set_theme_override":
      themeEntryValidators.exists(workspace, compatibilityThemeId(action))
      break
    case "delete_theme": {
      const themeId = action.payload.themeId
      themeEntryValidators.exists(workspace, themeId)
      const entry = workspace.themes[themeId]
      if (entry && isEntryThemeDefault(entry)) {
        throw new WorkspaceValidationError(
          "Cannot remove default theme entry",
          action,
        )
      }
      if (hasEffectiveThemeReference(workspace, themeId)) {
        throw new WorkspaceValidationError(
          `Theme ${themeId} is still in use (effective theme)`,
          action,
        )
      }
      break
    }
    case "duplicate_theme":
      themeEntryValidators.exists(workspace, action.payload.themeId)
      break
  }
}

function compatibilityThemeId(action: Action): string {
  return (action.payload as { themeId: string }).themeId
}
