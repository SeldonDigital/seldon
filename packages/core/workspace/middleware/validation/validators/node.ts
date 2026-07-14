import { getComponentSchema } from "../../../../components/catalog"
import { ComponentId, isComponentId } from "../../../../components/constants"
import { rules } from "../../../../rules/config/rules.config"
import { ErrorMessages } from "../../../constants"
import { getBoardByNodeId } from "../../../helpers/components/get-board-by-node-id"
import { getChildrenIds } from "../../../helpers/components/get-children-ids"
import { getVariantById } from "../../../helpers/general/get-variant-by-id"
import { isDefaultVariant } from "../../../helpers/general/is-default-variant"
import { isVariantInUse } from "../../../helpers/general/is-variant-in-use"
import { canNodeHaveChildren } from "../../../helpers/nodes/can-node-have-children"
import { collectTreeRefIds } from "../../../helpers/nodes/collect-tree-ref-ids"
import type {
  Instance,
  Variant,
} from "../../../helpers/rules/rules-node-subject"
import {
  nodeRelationshipService,
  nodeRetrievalService,
  nodeTraversalService,
  typeCheckingService,
} from "../../../services"
import { findTreeRef } from "../../../services/shared/component-tree-helpers"
import type {
  Action,
  EntryNode,
  InstanceId,
  VariantId,
  Workspace,
} from "../../../types"
import { check } from "../check"
import { getNodeComponentId } from "../node-component-id"
import { WorkspaceValidationError } from "../workspace-validation-error"

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
      !nodeRelationshipService.hasAncestorWithComponentId(
        sourceNodeComponent,
        targetNode,
        workspace,
      ),
      ErrorMessages.cannotAddSelfAsInstance(),
    )
  },
  notIntoOwnSubtree: (
    workspace: Workspace,
    nodeId: InstanceId | VariantId,
    parentId: InstanceId | VariantId,
  ) => {
    const board = getBoardByNodeId(workspace, nodeId)
    if (!board) return
    const treeRef = findTreeRef(board, nodeId)
    if (!treeRef) return
    // `collectTreeRefIds` includes the node itself, so this also rejects
    // moving a node directly under itself.
    const subtreeIds = new Set(collectTreeRefIds(treeRef))
    check(
      !subtreeIds.has(parentId),
      ErrorMessages.cannotMoveIntoOwnSubtree(nodeId),
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
  refIsUnique: (
    workspace: Workspace,
    { nodeId, ref }: { nodeId: InstanceId | VariantId; ref: string },
  ) => {
    const trimmed = ref.trim()
    if (trimmed === "") return
    const taken = Object.values(workspace.nodes).some(
      (node) => node.id !== nodeId && node.ref === trimmed,
    )
    check(!taken, ErrorMessages.refNotUnique(trimmed))
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
      const board = nodeRelationshipService.findBoardForVariant(
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
      assertFrameGrandchildrenAllowed(
        workspace,
        parentComponentId,
        childId,
        parentSchema,
        childSchema,
      )
    }
  },
}

/**
 * Frames inherit their parent's containment rules, so every frame grandchild
 * must also be allowed directly under the frame's parent component.
 */
function assertFrameGrandchildrenAllowed(
  workspace: Workspace,
  parentComponentId: ComponentId,
  frameId: InstanceId | VariantId,
  parentSchema: ReturnType<typeof getComponentSchema>,
  frameSchema: ReturnType<typeof getComponentSchema>,
): void {
  const board = getBoardByNodeId(workspace, frameId)
  if (!board) return

  for (const grandChildId of getChildrenIds(board, frameId)) {
    const grandChildNode = workspace.nodes[grandChildId]
    if (!grandChildNode) continue

    const grandChildComponent = getNodeComponentId(grandChildNode, workspace)
    if (
      typeCheckingService.canComponentBeParentOf(
        parentComponentId,
        grandChildComponent,
      )
    ) {
      continue
    }

    const grandChildSchema = getComponentSchema(grandChildComponent)
    check(
      false,
      ErrorMessages.invalidParentChildRelationship(
        parentSchema.name,
        `${frameSchema.name} containing ${grandChildSchema.name}`,
      ),
    )
  }
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
      nodeRelationshipService.hasAncestorWithComponentId(
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
