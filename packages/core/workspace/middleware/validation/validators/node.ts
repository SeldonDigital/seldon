import { getComponentSchema } from "../../../../components/catalog"
import { ComponentId, isComponentId } from "../../../../components/constants"
import { rules } from "../../../../rules/config/rules.config"
import { getChildrenIds } from "../../../helpers/components/get-children-ids"
import { getComponentByNodeId } from "../../../helpers/components/get-component-by-node-id"
import { isDefaultVariant } from "../../../helpers/general/is-default-variant"
import { canNodeHaveChildren } from "../../../helpers/nodes/can-node-have-children"
import { isVariantInUse } from "../../../helpers/general/is-variant-in-use"
import { getVariantById } from "../../../helpers/general/get-variant-by-id"
import { ErrorMessages } from "../../../constants"
import {
  nodeRetrievalService,
  nodeTraversalService,
  nodeRelationshipService,
  workspacePropagationService,
  typeCheckingService,
} from "../../../services"
import { check } from "../check"
import { getNodeComponentId } from "../node-component-id"
import { WorkspaceValidationError } from "../workspace-validation-error"
import type {
  Action,
  EntryNode,
  InstanceId,
  VariantId,
  Workspace,
} from "../../../types"
import type { Instance, Variant } from "../../../helpers/rules/rules-node-subject"

export function assertInsertTargetAllowed(
  parent: EntryNode,
  action: Action,
): void {
  const entity = typeCheckingService.getEntityType(parent)
  if (!rules.mutations.insertInto[entity].allowed) {
    throw new WorkspaceValidationError(
      "Cannot insert into default catalog variant; use overrides or a user variant.",
      action,
    )
  }
}

export function assertMoveTargetAllowed(
  parent: EntryNode,
  message: string,
): void {
  check(!typeCheckingService.isDefaultVariant(parent), message)
}

export const nodeValidators = {
  isNotInstanceOfSelf: (
    workspace: Workspace,
    subjectId: InstanceId | VariantId | ComponentId,
    targetId: InstanceId | VariantId,
  ) => {
    let sourceNodeComponent: ComponentId

    if (isComponentId(subjectId)) {
      sourceNodeComponent = subjectId
    } else {
      const sourceNode = nodeRetrievalService.getNode(subjectId, workspace)
      sourceNodeComponent = getNodeComponentId(sourceNode, workspace)
    }
    const targetNode = nodeRetrievalService.getNode(targetId, workspace)

    if (
      sourceNodeComponent === ComponentId.FRAME &&
      getNodeComponentId(targetNode, workspace) === ComponentId.FRAME
    ) {
      return
    }

    check(
      !workspacePropagationService.hasAncestorWithComponentId(
        sourceNodeComponent,
        targetNode,
        workspace,
      ),
      ErrorMessages.cannotAddSelfAsInstance(),
    )
  },
  isWithinSameVariant: (
    workspace: Workspace,
    nodeId: InstanceId | VariantId,
    parentId: InstanceId | VariantId,
  ) => {
    const node = workspace.nodes[nodeId]
    const parent = workspace.nodes[parentId]
    check(
      nodeRelationshipService.areWithinSameVariant(
        node as Variant | Instance,
        parent as Variant | Instance,
        workspace,
      ),
      ErrorMessages.cannotMoveToDifferentVariant(),
    )
  },
  exists: (workspace: Workspace, id: InstanceId | VariantId) => {
    check(workspace.nodes[id], ErrorMessages.nodeNotFound(id))
  },
  canHaveChildren: (workspace: Workspace, id: InstanceId | VariantId) => {
    const node = workspace.nodes[id]
    check(node, ErrorMessages.nodeNotFound(id))
    check(
      canNodeHaveChildren(node, workspace),
      ErrorMessages.childNotAllowed(id),
    )
  },
  moveAllowed: (workspace: Workspace, id: InstanceId | VariantId) => {
    const node = workspace.nodes[id]
    if (!node) {
      throw new Error(ErrorMessages.nodeNotFound(id))
    }
    if (typeCheckingService.isInstance(node)) {
      const parent = nodeTraversalService.findParentNode(node, workspace)
      if (!parent) {
        throw new Error(ErrorMessages.parentNotFound(id))
      }
    } else {
      const board = nodeRelationshipService.findComponentForVariant(
        node as Variant,
        workspace,
      )
      if (!board) {
        throw new Error(ErrorMessages.componentNotFoundForVariant(node.id))
      }
    }
  },
  canBeRemoved: (workspace: Workspace, id: VariantId | InstanceId) => {
    const node = workspace.nodes[id]
    if (!node) {
      throw new Error(ErrorMessages.nodeNotFound(id))
    }
    if (typeCheckingService.isInstance(node)) {
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
  canBeParentOf: (
    workspace: Workspace,
    parentId: InstanceId | VariantId | ComponentId,
    childId: InstanceId | VariantId,
  ) => {
    const parentComponentId = isComponentId(parentId)
      ? parentId
      : getNodeComponentId(
          nodeRetrievalService.getNode(parentId, workspace),
          workspace,
        )

    const childNode = nodeRetrievalService.getNode(childId, workspace)
    const childComponent = getNodeComponentId(childNode, workspace)

    const canBeParent = typeCheckingService.canComponentBeParentOf(
      parentComponentId,
      childComponent,
    )

    const parentSchema = getComponentSchema(parentComponentId)
    const childSchema = getComponentSchema(childComponent)
    check(
      canBeParent,
      ErrorMessages.invalidParentChildRelationship(
        parentSchema.name,
        childSchema.name,
      ),
    )

    if (childComponent === ComponentId.FRAME) {
      const board = getComponentByNodeId(workspace, childId)
      if (!board) return

      const frameChildIds = getChildrenIds(board, childId)
      for (const grandChildId of frameChildIds) {
        const grandChildNode = workspace.nodes[grandChildId]
        if (grandChildNode) {
          const grandChildComponent = getNodeComponentId(
            grandChildNode,
            workspace,
          )
          const canContainGrandChild =
            typeCheckingService.canComponentBeParentOf(
              parentComponentId,
              grandChildComponent,
            )

          if (!canContainGrandChild) {
            const grandChildSchema = getComponentSchema(grandChildComponent)
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
}

export function validateComponentCanBeInserted(
  componentId: ComponentId,
  targetNodeId: VariantId | InstanceId,
  workspace: Workspace,
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  try {
    const targetParent = nodeRetrievalService.getNode(targetNodeId, workspace)
    if (!targetParent) {
      errors.push(`Target parent ${targetNodeId} not found`)
      return { isValid: false, errors }
    }

    const entity = typeCheckingService.getEntityType(targetParent)
    if (!rules.mutations.insertInto[entity].allowed) {
      errors.push(
        "Cannot insert into default variant. Use a custom variant instead.",
      )
      return { isValid: false, errors }
    }

    const canBeParent = typeCheckingService.canComponentBeParentOf(
      getNodeComponentId(targetParent, workspace),
      componentId,
    )
    if (!canBeParent) {
      const parentSchema = getComponentSchema(
        getNodeComponentId(targetParent, workspace),
      )
      const childSchema = getComponentSchema(componentId)
      errors.push(
        ErrorMessages.invalidParentChildRelationship(
          parentSchema.name,
          childSchema.name,
        ),
      )
    }

    if (
      componentId !== ComponentId.FRAME &&
      workspacePropagationService.hasAncestorWithComponentId(
        componentId,
        targetParent,
        workspace,
      )
    ) {
      errors.push(ErrorMessages.cannotAddSelfAsInstance())
    }
  } catch (error) {
    errors.push(`Failed to validate component insertion: ${error}`)
  }

  return { isValid: errors.length === 0, errors }
}
