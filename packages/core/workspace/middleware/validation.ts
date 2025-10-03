import { getComponentSchema } from "../../components/catalog"
import { ComponentId, isComponentId } from "../../components/constants"
import { ThemeStaticSwatchId } from "../../themes/types"
import { ErrorMessages } from "../constants"
import { areBoardVariantsInUse } from "../helpers/are-board-variants-in-use"
import { getBoardById } from "../helpers/get-board-by-id"
import { getVariantById } from "../helpers/get-variant-by-id"
import { isDefaultVariant } from "../helpers/is-default-variant"
import { isUserVariant } from "../helpers/is-user-variant"
import { isVariantInUse } from "../helpers/is-variant-in-use"
import { isVariantNode } from "../helpers/is-variant-node"
import { nodeAllowsReordering } from "../helpers/node-allows-reordering"
import { workspaceService } from "../services/workspace.service"
import { Action, InstanceId, Middleware, VariantId, Workspace } from "../types"

/**
 * Custom error class for workspace validation failures.
 * Includes the action that caused the validation error for debugging.
 */
export class WorkspaceValidationError extends Error {
  action: Action

  constructor(message: string, action: Action) {
    super(message)
    this.name = "WorkspaceValidationError"
    this.action = action
  }
}

/**
 * Assertion function that throws an error if condition is falsy.
 * Unlike invariant, doesn't prefix messages or omit them in production.
 */
function check(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

const validators = {
  node: {
    /**
     * Validates that a component isn't being added as an instance of itself.
     * Allows Frame-to-Frame nesting as Frames are universal containers.
     */
    isNotInstanceOfSelf: (
      workspace: Workspace,
      subjectId: InstanceId | VariantId | ComponentId,
      targetId: InstanceId | VariantId,
    ) => {
      let sourceNodeComponent: ComponentId

      if (isComponentId(subjectId)) {
        sourceNodeComponent = subjectId
      } else {
        const sourceNode = workspaceService.getNode(subjectId, workspace)
        sourceNodeComponent = sourceNode.component
      }
      const targetNode = workspaceService.getNode(targetId, workspace)

      // Frame components can be nested within other Frames as they're universal containers
      if (
        sourceNodeComponent === ComponentId.FRAME &&
        targetNode.component === ComponentId.FRAME
      ) {
        return
      }

      check(
        !workspaceService.hasAncestorWithComponentId(
          sourceNodeComponent,
          targetNode,
          workspace,
        ),
        ErrorMessages.cannotAddSelfAsInstance(),
      )
    },
    /** Validates that a node move operation stays within the same variant. */
    isWithinSameVariant: (
      workspace: Workspace,
      nodeId: InstanceId | VariantId,
      parentId: InstanceId | VariantId,
    ) => {
      const node = workspace.byId[nodeId]
      const parent = workspace.byId[parentId]
      check(
        workspaceService.areWithinSameVariant(node, parent, workspace),
        ErrorMessages.cannotMoveToDifferentVariant(),
      )
    },
    /** Validates that a node exists in the workspace. */
    exists: (workspace: Workspace, id: InstanceId | VariantId) => {
      check(workspace.byId[id], ErrorMessages.nodeNotFound(id))
    },
    /** Validates that a node can have children. */
    canHaveChildren: (workspace: Workspace, id: InstanceId | VariantId) => {
      check(workspace.byId[id], ErrorMessages.nodeNotFound(id))
      check(workspace.byId[id].children, ErrorMessages.childNotAllowed(id))
    },
    /** Validates that a node can be moved (checks parent reordering permissions). */
    moveAllowed: (workspace: Workspace, id: InstanceId | VariantId) => {
      const node = workspace.byId[id]
      if (!node) {
        throw new Error(ErrorMessages.nodeNotFound(id))
      }
      if (workspaceService.isInstance(node)) {
        const parent = workspaceService.findParentNode(node, workspace)
        if (!parent) {
          throw new Error(ErrorMessages.parentNotFound(id))
        }

        if (!nodeAllowsReordering(parent.id, workspace)) {
          throw new Error(ErrorMessages.moveNotAllowed(id))
        }
      } else {
        const board = workspaceService.findBoardForVariant(node, workspace)
        if (!board) {
          throw new Error(ErrorMessages.boardNotFoundForVariant(node.id))
        }
      }
    },
    /** Validates that a node can be removed (variants must not be in use, not default). */
    canBeRemoved: (workspace: Workspace, id: VariantId | InstanceId) => {
      const node = workspace.byId[id]
      if (!node) {
        throw new Error(ErrorMessages.nodeNotFound(id))
      }
      if (workspaceService.isInstance(node)) {
        return
      }

      if (isVariantInUse(node.id, workspace)) {
        throw new Error(ErrorMessages.variantInUse(node.id))
      }

      const variant = getVariantById(node.id, workspace)

      if (isDefaultVariant(variant)) {
        throw new Error(ErrorMessages.defaultVariantCannotBeRemoved())
      }
    },
    /** Validates parent-child component hierarchy rules. Recursively checks Frame contents. */
    canBeParentOf: (
      workspace: Workspace,
      parentId: InstanceId | VariantId | ComponentId,
      childId: InstanceId | VariantId,
    ) => {
      const parentComponentId = isComponentId(parentId)
        ? parentId
        : workspace.byId[parentId].component

      const childNode = workspace.byId[childId]

      const canBeParent = workspaceService.canComponentBeParentOf(
        parentComponentId,
        childNode.component,
      )

      const parentSchema = getComponentSchema(parentComponentId)
      const childSchema = getComponentSchema(childNode.component)
      check(
        canBeParent,
        ErrorMessages.invalidParentChildRelationship(
          parentSchema.name,
          childSchema.name,
        ),
      )

      // If child is a Frame, validate that parent can contain all Frame contents
      if (childNode.component === ComponentId.FRAME && childNode.children) {
        for (const grandChildId of childNode.children) {
          const grandChildNode = workspace.byId[grandChildId]
          if (grandChildNode) {
            const canContainGrandChild =
              workspaceService.canComponentBeParentOf(
                parentComponentId,
                grandChildNode.component,
              )

            if (!canContainGrandChild) {
              const grandChildSchema = getComponentSchema(
                grandChildNode.component,
              )
              check(
                false,
                ErrorMessages.invalidParentChildRelationship(
                  parentSchema.name,
                  `${childSchema.name} containing ${grandChildSchema.name}`,
                ),
              )
            }
          }
        }
      }
    },
  },
  board: {
    /** Validates that a board exists in the workspace. */
    exists: (workspace: Workspace, id: ComponentId) => {
      check(workspace.boards[id], ErrorMessages.boardNotFound(id))
    },
    /** Validates that a board doesn't already exist. */
    doesNotExist: (workspace: Workspace, id: ComponentId) => {
      check(!workspace.boards[id], ErrorMessages.boardAlreadyExists(id))
    },
    /** Validates that a board's variants are not in use before removal. */
    notInUse: (workspace: Workspace, id: ComponentId) => {
      const board = workspace.boards[id]
      if (board && areBoardVariantsInUse(board, workspace)) {
        throw new Error(ErrorMessages.boardVariantsInUse(id))
      }
    },
    /** Validates that a board has at least one variant. */
    hasDefaultVariant: (workspace: Workspace, id: ComponentId) => {
      const board = workspace.boards[id]!
      check(board.variants.length > 0, ErrorMessages.defaultVariantNotFound(id))
    },
  },
  variant: {
    /** Validates that a variant exists in the workspace. */
    exists: (workspace: Workspace, id: VariantId) => {
      check(workspace.byId[id], ErrorMessages.variantNotFound(id))
    },
    /** Validates that a variant label is unique within its component board. */
    labelIsUnique: (
      workspace: Workspace,
      { nodeId, label }: { nodeId: VariantId | InstanceId; label: string },
    ) => {
      const variant = workspace.byId[nodeId]
      if (!variant) {
        throw new Error(ErrorMessages.nodeNotFound(nodeId))
      }
      const component = variant.component
      const board = getBoardById(component, workspace)
      const isLabelTaken = board.variants.some((nodeId) => {
        const variant = getVariantById(nodeId, workspace)
        return (
          isUserVariant(variant) &&
          variant.label === label &&
          variant.id !== nodeId
        )
      })

      if (isLabelTaken) {
        throw new Error(ErrorMessages.variantLabelNotUnique(label))
      }
    },
    /** Validates that a variant isn't being moved to the default position (index 0). */
    notToDefaultPosition: (
      workspace: Workspace,
      id: VariantId | InstanceId,
      index: number,
    ) => {
      const node = workspace.byId[id]
      if (!node) {
        throw new Error(ErrorMessages.nodeNotFound(id))
      }
      if (isVariantNode(node) && index === 0) {
        throw new Error(ErrorMessages.cannotMoveToDefaultPosition())
      }
    },
  },
  customTheme: {
    /** Validates that a custom theme swatch exists. */
    swatchExists: (workspace: Workspace, id: ThemeStaticSwatchId) => {
      const swatch = workspace.customTheme.swatch[id]
      check(swatch, ErrorMessages.swatchNotFound(id))
    },
  },
}

/**
 * Middleware that validates actions before they're processed by the reducer.
 * Throws WorkspaceValidationError for invalid operations.
 */
export const validationMiddleware: Middleware =
  (next) => (workspace, action) => {
    try {
      switch (action.type) {
        case "ai_add_component":
        case "add_board": {
          validators.board.doesNotExist(workspace, action.payload.componentId)
          break
        }

        case "ai_reorder_node":
        case "reorder_node": {
          const nodeId = action.payload.nodeId as InstanceId | VariantId
          const index = action.payload.newIndex

          validators.node.exists(workspace, nodeId)
          validators.node.moveAllowed(workspace, nodeId)
          validators.variant.notToDefaultPosition(workspace, nodeId, index)
          break
        }

        case "ai_remove_node":
        case "remove_node": {
          const nodeId = action.payload.nodeId as InstanceId | VariantId

          validators.node.canBeRemoved(workspace, nodeId)
          validators.node.exists(workspace, nodeId)
          break
        }

        case "ai_set_node_properties":
        case "set_node_properties":
        case "ai_set_node_theme":
        case "set_node_theme": {
          const nodeId = action.payload.nodeId as InstanceId | VariantId

          validators.node.exists(workspace, nodeId)
          break
        }

        case "ai_set_node_label":
        case "set_node_label": {
          const nodeId = action.payload.nodeId as InstanceId | VariantId
          const label = action.payload.label

          validators.node.exists(workspace, nodeId)
          validators.variant.labelIsUnique(workspace, { nodeId, label })
          break
        }

        case "ai_set_board_properties":
        case "set_board_properties":
        case "ai_set_board_theme":
        case "set_board_theme": {
          const componentId = action.payload.componentId

          validators.board.exists(workspace, componentId)
          break
        }

        case "remove_board": {
          validators.board.exists(workspace, action.payload.componentId)
          validators.board.notInUse(workspace, action.payload.componentId)
          break
        }

        case "add_board_and_insert_default_variant": {
          const componentId = action.payload.componentId
          const parentId = action.payload.target.parentId as
            | InstanceId
            | VariantId

          validators.board.doesNotExist(workspace, componentId)
          validators.node.exists(workspace, parentId)
          validators.node.canHaveChildren(workspace, parentId)
          validators.node.isNotInstanceOfSelf(workspace, componentId, parentId)
          break
        }

        case "ai_insert_node":
        case "insert_node": {
          const nodeId = action.payload.nodeId as InstanceId | VariantId
          const parentId = action.payload.target.parentId as
            | InstanceId
            | VariantId

          validators.node.exists(workspace, parentId)
          validators.node.canHaveChildren(workspace, parentId)
          validators.node.isNotInstanceOfSelf(workspace, nodeId, parentId)
          validators.node.canBeParentOf(workspace, parentId, nodeId)
          break
        }

        case "move_node":
        case "ai_move_node": {
          const nodeId = action.payload.nodeId as InstanceId | VariantId
          const parentId = action.payload.target.parentId as
            | InstanceId
            | VariantId

          validators.node.exists(workspace, parentId)
          validators.node.canHaveChildren(workspace, parentId)
          validators.node.isNotInstanceOfSelf(workspace, nodeId, parentId)
          validators.node.isWithinSameVariant(workspace, nodeId, parentId)
          validators.node.canBeParentOf(workspace, parentId, nodeId)
          break
        }

        case "ai_remove_custom_theme_swatch":
        case "remove_custom_theme_swatch": {
          validators.customTheme.swatchExists(workspace, action.payload.key)
          break
        }

        case "ai_update_custom_theme_swatch":
        case "update_custom_theme_swatch": {
          validators.customTheme.swatchExists(workspace, action.payload.key)
          break
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new WorkspaceValidationError(error.message, action)
      }
      throw error
    }

    return next(workspace, action)
  }
