import { ComponentId, isComponentId } from "../../components/constants"
import { invariant } from "../../index"
import { ErrorMessages } from "../constants"
import {
  Board,
  DefaultVariant,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
} from "../types"

/**
 * Service for retrieving nodes, boards, and related entities from the workspace.
 */
export class NodeRetrievalService {
  /**
   * Gets a board by component ID.
   * @param componentId - The component identifier
   * @param workspace - The workspace
   * @returns The board
   */
  public getBoard(componentId: ComponentId, workspace: Workspace): Board {
    const board = workspace.boards[componentId]
    invariant(board, ErrorMessages.boardNotFound(componentId))
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
    const node = workspace.byId[nodeId]
    invariant(node, ErrorMessages.nodeNotFound(nodeId))
    return node
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
    return Object.values(workspace.byId)
  }

  /**
   * Gets a variant by ID.
   * @param variantId - The variant identifier
   * @param workspace - The workspace
   * @returns The variant
   */
  public getVariant(variantId: VariantId, workspace: Workspace): Variant {
    const node = workspace.byId[variantId]
    invariant(node, ErrorMessages.variantNotFound(variantId))

    if (!this.isVariant(node)) {
      throw new Error(ErrorMessages.nodeNotVariant(variantId))
    }

    return node
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
    const variantId = `variant-${componentId}-default` as VariantId
    return this.getVariant(variantId, workspace) as DefaultVariant
  }

  /**
   * Gets an instance by ID.
   * @param instanceId - The instance identifier
   * @param workspace - The workspace
   * @returns The instance
   */
  public getInstance(instanceId: InstanceId, workspace: Workspace): Instance {
    const node = this.getNode(instanceId, workspace)

    if (this.isVariant(node)) {
      throw new Error(ErrorMessages.nodeNotInstance(instanceId))
    }

    return node
  }

  /**
   * Type guard to check if a node is a variant.
   * @param node - The node to check
   * @returns True if the node is a variant
   */
  private isVariant(
    node: Variant | Instance | Board | undefined,
  ): node is Variant {
    return node !== undefined && !("variant" in node)
  }
}

export const nodeRetrievalService = new NodeRetrievalService()
