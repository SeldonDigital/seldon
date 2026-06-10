import { ComponentId, isComponentId } from "../../../components/constants"
import { invariant } from "../../../index"
import { ErrorMessages } from "../../constants"
import { getWorkspaceNodes } from "../../helpers/general/get-workspace-nodes"
import {
  Board,
  BoardKey,
  DefaultVariant,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
} from "../../types"
import { typeCheckingService } from "../type-checking/type-checking.service"

/**
 * Service for retrieving nodes, boards, and related entities from the workspace.
 */
export class NodeRetrievalService {
  /**
   * Gets a board by `workspace.boards` key.
   * @param boardKey - Board key in the workspace
   * @param workspace - The workspace
   * @returns The board
   */
  public getBoard(boardKey: BoardKey, workspace: Workspace): Board {
    const board = workspace.boards[boardKey]
    invariant(board, ErrorMessages.componentNotFound(boardKey))
    return board
  }

  /**
   * Gets a node by ID.
   * @param nodeId - The node identifier
   * @param workspace - The workspace
   * @returns The node
   */
  public getNode(
    nodeId: InstanceId | VariantId,
    workspace: Workspace,
  ): Variant | Instance {
    const node = getWorkspaceNodes(workspace)[nodeId]
    invariant(node, ErrorMessages.nodeNotFound(nodeId))
    return node as Variant | Instance
  }

  /**
   * Gets a node or board by ID.
   * @param objectId - The object identifier (node or board)
   * @param workspace - The workspace
   * @returns The node or board
   */
  public getObject(
    objectId: InstanceId | VariantId | ComponentId,
    workspace: Workspace,
  ): Variant | Instance | Board {
    if (isComponentId(objectId)) {
      return this.getBoard(objectId, workspace)
    }
    return this.getNode(objectId, workspace)
  }

  /**
   * Gets all nodes from the workspace.
   * @param workspace - The workspace
   * @returns Array of all variants and instances
   */
  public getNodes(workspace: Workspace): (Variant | Instance)[] {
    return Object.values(getWorkspaceNodes(workspace)) as (Variant | Instance)[]
  }

  /**
   * Gets a variant by ID.
   * @param variantId - The variant identifier
   * @param workspace - The workspace
   * @returns The variant
   */
  public getVariant(variantId: VariantId, workspace: Workspace): Variant {
    const node = getWorkspaceNodes(workspace)[variantId]
    invariant(node, ErrorMessages.variantNotFound(variantId))

    if (!typeCheckingService.isVariant(node)) {
      throw new Error(ErrorMessages.nodeNotVariant(variantId))
    }

    return node as Variant
  }

  /**
   * Gets the default variant for a component.
   * @param componentId - The component identifier
   * @param workspace - The workspace
   * @returns The default variant
   */
  public getDefaultVariant(
    componentId: ComponentId,
    workspace: Workspace,
  ): DefaultVariant {
    const board = this.getBoard(componentId, workspace)
    const rootRef = board.variants[0]
    invariant(
      rootRef,
      `Missing default variant root ref on board ${componentId}`,
    )
    return this.getVariant(rootRef.id as VariantId, workspace) as DefaultVariant
  }

  /**
   * Gets an instance by ID.
   * @param instanceId - The instance identifier
   * @param workspace - The workspace
   * @returns The instance
   */
  public getInstance(instanceId: InstanceId, workspace: Workspace): Instance {
    const node = this.getNode(instanceId, workspace)

    if (typeCheckingService.isVariant(node)) {
      throw new Error(ErrorMessages.nodeNotInstance(instanceId))
    }

    return node as Instance
  }
}

export const nodeRetrievalService = new NodeRetrievalService()
