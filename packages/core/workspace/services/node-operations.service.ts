import { WritableDraft, isDraft, produce } from "immer"
import { ComponentId } from "../../components/constants"
import { invariant } from "../../index"
import { ErrorMessages } from "../constants"
import { moveItemInArray } from "../helpers/move-utils"
import { Instance, InstanceId, Variant, VariantId, Workspace } from "../types"
import { nodeRelationshipService } from "./node-relationship.service"
import { nodeRetrievalService } from "./node-retrieval.service"
import { nodeTraversalService } from "./node-traversal.service"
import {
  generateFallbackId,
  handleNodeNotFoundError,
} from "./shared/error-handling.helper"
import {
  createInstanceNode,
  createVariantNode,
  insertAfter,
} from "./shared/node-factory.helper"
import { mutateWorkspace } from "./shared/workspace-mutation.helper"
import {
  withInstanceAndParentMutation,
  withNodeMutation,
  withVariantAndBoardMutation,
} from "./shared/workspace-operation-helpers"
import { typeCheckingService } from "./type-checking.service"
import { workspaceService } from "./workspace.service"

/**
 * Service for node CRUD operations and workspace mutations.
 */
export class NodeOperationsService {
  /**
   * Inserts a node and its children into another node.
   * @param nodeId - The node to insert
   * @param parentId - The parent node to insert into
   * @param parentIndex - Optional index position (defaults to beginning)
   * @param workspace - The workspace
   * @returns The updated workspace and created node ID
   */
  public insertNode(
    {
      nodeId,
      parentId,
      parentIndex,
    }: {
      nodeId: VariantId | InstanceId
      parentId: VariantId | InstanceId
      parentIndex?: number
    },
    workspace: Workspace,
  ): { workspace: Workspace; createdNodeId: InstanceId } {
    let newId: InstanceId
    const updatedWorkspace = produce(workspace, (draft) => {
      const parentNode = nodeRetrievalService.getNode(parentId, draft)

      invariant(
        parentNode.children,
        `Node ${parentNode.id} can't have children`,
      )

      const { newId: newNodeId, workspace: newWorkspace } =
        this._instantiateNode(nodeId, draft)

      draft.byId = newWorkspace.byId

      if (parentIndex === undefined) {
        parentNode.children.unshift(newNodeId)
      } else {
        parentNode.children.splice(parentIndex, 0, newNodeId)
      }

      newId = newNodeId
    })
    return {
      workspace: updatedWorkspace,
      createdNodeId: newId!,
    }
  }

  /**
   * Deletes a board and all its variants, cleaning up references.
   * @param componentId - The component ID to delete
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public deleteBoard(
    componentId: ComponentId,
    workspace: Workspace,
  ): Workspace {
    const workspaceAfterDeletion = mutateWorkspace(workspace, (draft) => {
      const board = draft.boards[componentId]
      if (!board) return

      const nodesId = Object.values(draft.byId)
        .filter((node) => node.component === componentId)
        .map((node) => node.id)

      for (const variantId of board.variants) {
        const workspaceWithoutVariant = this.deleteVariant(variantId, draft)
        draft.byId = workspaceWithoutVariant.byId
      }

      for (const node of Object.values(draft.byId)) {
        if (node.children) {
          node.children = node.children.filter(
            (childId) => !nodesId.includes(childId),
          )
        }
      }

      delete draft.boards[componentId]
    })

    // Realign board order after deletion to fix order indices
    return workspaceService.realignBoardOrder(workspaceAfterDeletion)
  }

  /**
   * Deletes an instance and all its children.
   * @param instanceId - The instance ID to delete
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public deleteInstance(
    instanceId: InstanceId,
    workspace: Workspace,
  ): Workspace {
    return withInstanceAndParentMutation(
      instanceId,
      workspace,
      (instance, parent, draft) => {
        const instanceIndex = parent.children!.indexOf(instanceId)
        parent.children?.splice(instanceIndex, 1)

        this._deleteNodeFromDraft(instanceId, draft)
      },
    )
  }

  /**
   * Moves a node to a new parent and position.
   * @param nodeId - The node ID to move
   * @param newPosition - The target parent and index
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public moveNode(
    nodeId: InstanceId,
    newPosition: {
      parentId: VariantId | InstanceId
      index: number
    },
    workspace: Workspace,
  ): Workspace {
    return withNodeMutation(nodeId, workspace, (node, draft) => {
      const currentParent = nodeTraversalService.findParentNode(node, draft)
      invariant(currentParent, `Parent not found for node ${nodeId}`)

      currentParent.children = currentParent.children!.filter(
        (childId) => childId !== nodeId,
      )

      const newParent = nodeRetrievalService.getNode(
        newPosition.parentId,
        draft,
      )

      invariant(newParent.children, `Node ${newParent.id} can't have children`)

      if (newPosition.index === undefined) {
        newParent.children.unshift(nodeId)
      } else {
        newParent.children.splice(newPosition.index, 0, nodeId)
      }
    })
  }

  /**
   * Deletes a variant and all its instances.
   * @param variantId - The variant ID to delete
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public deleteVariant(variantId: VariantId, workspace: Workspace): Workspace {
    return withNodeMutation(variantId, workspace, (variant, draft) => {
      for (const board of Object.values(draft.boards)) {
        if (board) {
          board.variants = board.variants.filter(
            (id: VariantId) => id !== variantId,
          )
        }
      }

      for (const [id, node] of Object.entries(draft.byId)) {
        if (
          typeCheckingService.isInstance(node) &&
          node.variant === variantId
        ) {
          this._deleteNodeFromDraft(id as InstanceId, draft)
        }
      }

      this._deleteNodeFromDraft(variantId, draft)
    })
  }

  /**
   * Recursively deletes a node and all its children from the draft.
   * @param nodeId - The node ID to delete
   * @param draftWorkspace - The draft workspace
   */
  private _deleteNodeFromDraft(
    nodeId: VariantId | InstanceId,
    draftWorkspace: WritableDraft<Workspace>,
  ): void {
    if (!isDraft(draftWorkspace)) {
      throw new Error("Workspace is not an immer draft")
    }

    const node = draftWorkspace.byId[nodeId]
    if (!node) {
      handleNodeNotFoundError(nodeId, "deletion")
      return
    }

    node.children?.forEach((childId) => {
      this._deleteNodeFromDraft(
        childId as VariantId | InstanceId,
        draftWorkspace,
      )
    })

    delete draftWorkspace.byId[nodeId]
  }

  /**
   * Duplicates a node and all its children.
   * @param nodeId - The node ID to duplicate
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public duplicateNode(
    nodeId: VariantId | InstanceId,
    workspace: Workspace,
  ): Workspace {
    return withNodeMutation(nodeId, workspace, (node, draft) => {
      if (typeCheckingService.isVariant(node)) {
        const { newId, workspace: newWorkspace } = this._duplicateVariant(
          nodeId as VariantId,
          draft,
        )

        const board = nodeRelationshipService.findBoardForVariant(
          node,
          newWorkspace,
        )
        invariant(board, ErrorMessages.boardNotFoundForVariant(node.id))

        if (typeCheckingService.isDefaultVariant(node)) {
          board.variants.push(newId)
        } else {
          insertAfter(board.variants, node.id, newId)
        }

        Object.assign(draft.byId, newWorkspace.byId)
      } else {
        const { newId, workspace: newWorkspace } = this._duplicateInstance(
          node.id,
          draft,
        )

        const parent = nodeTraversalService.findParentNode(node, newWorkspace)
        if (!parent) {
          throw new Error(ErrorMessages.parentNotFound(nodeId))
        }

        insertAfter(parent.children!, nodeId, newId)

        Object.assign(draft.byId, newWorkspace.byId)
      }
    })
  }

  /**
   * Duplicates a variant and all its children.
   * @param nodeId - The variant ID to duplicate
   * @param workspace - The workspace
   * @returns The new variant ID and updated workspace
   */
  private _duplicateVariant(
    nodeId: VariantId,
    workspace: Workspace,
  ): { newId: VariantId; workspace: Workspace } {
    try {
      const node = nodeRetrievalService.getVariant(nodeId, workspace)
      const isDefaultVariant = typeCheckingService.isDefaultVariant(node)

      const { newId, newNode } = createVariantNode(node, {
        isDefaultVariant: false, // Duplicates should always be user variants
        fromSchema: false,
        properties: node.properties, // Always use original variant's properties
        label: workspaceService.getInitialVariantLabel(
          node.component,
          workspace.byId,
        ),
      })

      const newWorkspace = mutateWorkspace(workspace, (draft) => {
        if (node.children) {
          const newChildren: InstanceId[] = []
          for (const childId of node.children) {
            const { newId, workspace: withDuplicatedChild } = isDefaultVariant
              ? this._instantiateInstance(childId, draft)
              : this._duplicateInstance(childId, draft)

            newChildren.push(newId as InstanceId)
            Object.assign(draft.byId, withDuplicatedChild.byId)
          }
          newNode.children = newChildren
        }

        draft.byId[newId] = newNode
      })

      return { newId, workspace: newWorkspace }
    } catch (error) {
      return {
        newId: generateFallbackId("variant", nodeId) as VariantId,
        workspace,
      }
    }
  }

  /**
   * Duplicates an instance and all its children.
   * @param nodeId - The instance ID to duplicate
   * @param workspace - The workspace
   * @returns The new instance ID and updated workspace
   */
  private _duplicateInstance(
    nodeId: InstanceId,
    workspace: Workspace,
  ): { newId: InstanceId; workspace: Workspace } {
    try {
      const node = nodeRetrievalService.getInstance(nodeId, workspace)

      const { newId, newNode } = createInstanceNode(node, {
        fromSchema: false,
        properties: node.properties,
      })

      const newWorkspace = mutateWorkspace(workspace, (draft) => {
        if (node.children) {
          const newChildren: InstanceId[] = []
          for (const childId of node.children) {
            const { newId, workspace: withDuplicatedChild } =
              this._duplicateInstance(childId, draft)
            newChildren.push(newId as InstanceId)
            Object.assign(draft.byId, withDuplicatedChild.byId)
          }
          newNode.children = newChildren
        }

        draft.byId[newId] = newNode
      })

      return { newId, workspace: newWorkspace }
    } catch (error) {
      return {
        newId: generateFallbackId("instance", nodeId) as InstanceId,
        workspace,
      }
    }
  }

  /**
   * Creates an instance from a node (variant or instance).
   * @param nodeId - The node ID to instantiate
   * @param workspace - The workspace
   * @returns The new instance ID and updated workspace
   */
  private _instantiateNode(
    nodeId: InstanceId | VariantId,
    workspace: Workspace,
  ): { newId: InstanceId; workspace: Workspace } {
    try {
      const node = nodeRetrievalService.getNode(nodeId, workspace)
      if (typeCheckingService.isInstance(node)) {
        return this._instantiateInstance(node.id, workspace)
      }

      return this._instantiateVariant(node.id, workspace)
    } catch (error) {
      return {
        newId: generateFallbackId("node", nodeId) as InstanceId,
        workspace,
      }
    }
  }

  /**
   * Creates an instance from a variant.
   * @param nodeId - The variant ID to instantiate
   * @param workspace - The workspace
   * @returns The new instance ID and updated workspace
   */
  private _instantiateVariant(
    nodeId: VariantId,
    workspace: Workspace,
  ): { newId: InstanceId; workspace: Workspace } {
    try {
      const node = nodeRetrievalService.getVariant(nodeId, workspace)

      const tempInstance: Instance = {
        id: `temp-${nodeId}` as InstanceId,
        component: node.component,
        level: node.level,
        isChild: true,
        fromSchema: false,
        variant: nodeId,
        instanceOf: nodeId,
        theme: node.theme,
        label: node.label,
        properties: node.properties,
        children: [],
      }

      const { newId, newNode } = createInstanceNode(tempInstance, {
        instanceOf: nodeId,
        fromSchema: false,
        properties: {},
        variant: nodeId,
      })

      const newWorkspace = mutateWorkspace(workspace, (draft) => {
        if (node.children) {
          const newChildren: InstanceId[] = []
          for (const childId of node.children) {
            const { newId, workspace: withDuplicatedChild } =
              this._instantiateInstance(childId, draft)

            newChildren.push(newId)
            Object.assign(draft.byId, withDuplicatedChild.byId)
          }
          newNode.children = newChildren
        }

        draft.byId[newId] = newNode
      })

      return { newId, workspace: newWorkspace }
    } catch (error) {
      return {
        newId: generateFallbackId("variant-instance", nodeId) as InstanceId,
        workspace,
      }
    }
  }

  /**
   * Creates a new instance from an existing instance.
   * @param nodeId - The instance ID to instantiate
   * @param workspace - The workspace
   * @returns The new instance ID and updated workspace
   */
  private _instantiateInstance(
    nodeId: InstanceId,
    workspace: Workspace,
  ): { newId: InstanceId; workspace: Workspace } {
    try {
      const node = nodeRetrievalService.getInstance(nodeId, workspace)

      const { newId, newNode } = createInstanceNode(node, {
        instanceOf: nodeId,
        fromSchema: false,
        properties: {},
      })

      const newWorkspace = mutateWorkspace(workspace, (draft) => {
        if (node.children) {
          const newChildren: InstanceId[] = []
          for (const childId of node.children) {
            const { newId, workspace: withDuplicatedChild } =
              this._instantiateInstance(childId, draft)

            newChildren.push(newId)
            Object.assign(draft.byId, withDuplicatedChild.byId)
          }
          newNode.children = newChildren
        }

        draft.byId[newId] = newNode
      })

      return { newId, workspace: newWorkspace }
    } catch (error) {
      return {
        newId: generateFallbackId("instance-instance", nodeId) as InstanceId,
        workspace,
      }
    }
  }

  /**
   * Moves an instance to a specific index within its parent.
   * @param node - The node to move
   * @param index - The target index
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public moveInstanceToIndex(
    node: Variant | Instance,
    index: number,
    workspace: Workspace,
  ): Workspace {
    if (!typeCheckingService.isInstance(node)) return workspace

    return withInstanceAndParentMutation(
      node.id,
      workspace,
      (instance, parent, draft) => {
        const currentIndex = nodeRelationshipService.getInstanceIndex(
          instance,
          draft,
        )

        if (currentIndex === -1 || currentIndex === index) return

        const childToMove = parent.children![currentIndex]
        moveItemInArray(parent.children!, childToMove, index)
      },
    )
  }

  /**
   * Moves a variant to a specific index within its board.
   * @param node - The node to move
   * @param index - The target index
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public reorderVariantIndex(
    node: Variant | Instance,
    index: number,
    workspace: Workspace,
  ): Workspace {
    if (!typeCheckingService.isVariant(node)) return workspace

    return withVariantAndBoardMutation(
      node.id,
      workspace,
      (variant, board, draft) => {
        const currentIndex = nodeRelationshipService.getVariantIndex(
          variant,
          draft,
        )
        if (currentIndex === -1 || currentIndex === index) return

        moveItemInArray(board.variants, variant.id, index)
      },
    )
  }
}

export const nodeOperationsService = new NodeOperationsService()
