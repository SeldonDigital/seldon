import { getComponentSchema } from "../../components/catalog"
import { ComponentId } from "../../components/constants"
import { invariant } from "../../index"
import { ErrorMessages } from "../constants"
import {
  Board,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
} from "../types"
import { nodeRetrievalService } from "./node-retrieval.service"
import { nodeTraversalService } from "./node-traversal.service"
import { withParentNode } from "./shared/workspace-operation-helpers"
import { typeCheckingService } from "./type-checking.service"

/**
 * Service for managing node relationships and hierarchy operations.
 */
export class NodeRelationshipService {
  /**
   * Gets the index of an instance within its parent's children array.
   * @param node - The instance node
   * @param workspace - The workspace
   * @returns The index of the instance
   */
  public getInstanceIndex(node: Instance, workspace: Workspace): number {
    const { result } = withParentNode(node, workspace, (parent) => {
      invariant(parent.children, `Parent ${parent.id} has no children`)
      return parent.children.findIndex((childId) => childId === node.id)
    })
    return result
  }

  /**
   * Gets the index of a variant within its board's variants array.
   * @param node - The variant node
   * @param workspace - The workspace
   * @returns The index of the variant
   */
  public getVariantIndex(node: Variant, workspace: Workspace): number {
    const board = this.findBoardForVariant(node, workspace)
    invariant(board, ErrorMessages.boardNotFoundForVariant(node.id))

    return board.variants.findIndex((childId) => childId === node.id)
  }

  /**
   * Finds the adjacent node or variant (before or after) of the given node.
   * @param node - The node to find adjacent to
   * @param placement - Whether to find "before" or "after" the node
   * @param workspace - The workspace
   * @returns The adjacent node or variant, or null if not found
   */
  public findAdjacent(
    node: Instance | Variant,
    placement: "before" | "after",
    workspace: Workspace,
  ): Instance | Variant | null {
    if (typeCheckingService.isInstance(node)) {
      return this.findAdjacentNode(node, placement, workspace)
    }

    return this.findAdjacentVariant(node, placement, workspace)
  }

  /**
   * Finds the adjacent instance (before or after) of the given instance.
   * @param node - The instance to find adjacent to
   * @param placement - Whether to find "before" or "after" the instance
   * @param workspace - The workspace
   * @returns The adjacent instance, or null if not found
   */
  public findAdjacentNode(
    node: Instance,
    placement: "before" | "after",
    workspace: Workspace,
  ): Instance | null {
    const ownIndex = this.getInstanceIndex(node, workspace)
    const targetIndex = placement === "before" ? ownIndex - 1 : ownIndex + 1

    const { result } = withParentNode(node, workspace, (parent) => {
      const children = parent.children
      if (!children) return null

      if (targetIndex < 0 || targetIndex >= children.length) return null

      for (const childId of children) {
        const child = nodeRetrievalService.getNode(childId, workspace)
        if (typeCheckingService.isInstance(child)) {
          if (this.getInstanceIndex(child, workspace) === targetIndex) {
            return child
          }
        }
      }

      return null
    })
    return result
  }

  /**
   * Finds the adjacent variant (before or after) of the given variant.
   * @param node - The variant to find adjacent to
   * @param placement - Whether to find "before" or "after" the variant
   * @param workspace - The workspace
   * @returns The adjacent variant, or null if not found
   */
  public findAdjacentVariant(
    node: Variant,
    placement: "before" | "after",
    workspace: Workspace,
  ): Variant | null {
    const ownIndex = this.getVariantIndex(node, workspace)
    const targetIndex = placement === "before" ? ownIndex - 1 : ownIndex + 1

    const board = this.findBoardForVariant(node, workspace)
    if (!board) return null

    const children = board.variants
    if (!children) return null

    for (const childId of children) {
      const child = nodeRetrievalService.getNode(childId, workspace)
      if (typeCheckingService.isVariant(child)) {
        if (this.getVariantIndex(child, workspace) === targetIndex) {
          return child
        }
      }
    }

    return null
  }

  /**
   * Finds the board containing the given variant.
   * @param variant - The variant to find the board for
   * @param workspace - The workspace
   * @returns The board, or null if not found
   */
  public findBoardForVariant(
    variant: Variant,
    workspace: Workspace,
  ): Board | null {
    return (
      Object.values(workspace.boards).find((board) =>
        board.variants.includes(variant.id),
      ) ?? null
    )
  }

  /**
   * Finds the board containing the given node.
   * @param node - The node to find the board for
   * @param workspace - The workspace
   * @returns The board, or null if not found
   */
  public findBoardForNode(
    node: Variant | Instance,
    workspace: Workspace,
  ): Board | null {
    if (typeCheckingService.isVariant(node)) {
      return this.findBoardForVariant(node, workspace)
    }

    const variant = this.getRootVariant(node, workspace)
    return this.findBoardForVariant(variant, workspace)
  }

  /**
   * Finds the first ancestor that can contain children.
   * @param node - The node to start from (can be node object or ID)
   * @param workspace - The workspace
   * @returns The container node
   */
  public findContainerNode(
    node: Variant | Instance | VariantId | InstanceId,
    workspace: Workspace,
  ): Variant | Instance {
    let currentNode =
      typeof node === "string"
        ? nodeRetrievalService.getNode(node, workspace)
        : node

    while (currentNode) {
      try {
        const schema = getComponentSchema(currentNode.component)
        if (
          currentNode.children &&
          schema.restrictions?.addChildren !== false
        ) {
          return currentNode
        }
      } catch (error) {
        console.warn(
          `Failed to get schema for component ${currentNode.component}, skipping container check:`,
          error,
        )
      }

      const parentNode = nodeTraversalService.findParentNode(
        currentNode,
        workspace,
      )
      if (!parentNode) break
      currentNode = parentNode
    }

    throw new Error(`No container node found for ${node}`)
  }

  /**
   * Gets the root variant for the given node.
   * @param node - The node to start from
   * @param workspace - The workspace
   * @returns The root variant
   */
  public getRootVariant(
    node: Variant | Instance,
    workspace: Workspace,
  ): Variant {
    let currentNode = node

    while (currentNode) {
      const parentNode = nodeTraversalService.findParentNode(
        currentNode,
        workspace,
      )
      if (!parentNode) break
      currentNode = parentNode
    }

    if (typeCheckingService.isVariant(currentNode)) {
      return currentNode
    }

    throw new Error(`Expected the root node for ${node.id} to be a variant`)
  }

  /**
   * Checks if two nodes belong to the same variant.
   * @param node - The first node
   * @param otherNode - The second node
   * @param workspace - The workspace
   * @returns True if both nodes belong to the same variant
   */
  public areWithinSameVariant(
    node: Variant | Instance,
    otherNode: Variant | Instance,
    workspace: Workspace,
  ): boolean {
    return (
      this.getRootVariant(node, workspace).id ===
      this.getRootVariant(otherNode, workspace).id
    )
  }

  /**
   * Finds all instances that reference the given source node.
   * @param node - The source node to find instances of
   * @param workspace - The workspace
   * @returns Array of instances
   */
  public findInstances(
    node: Variant | Instance,
    workspace: Workspace,
  ): (Variant | Instance)[] {
    return Object.values(workspace.byId)
      .filter(typeCheckingService.isInstance)
      .filter((possibleInstance) => possibleInstance.instanceOf === node.id)
  }

  /**
   * Finds all nodes that share the same variant.
   * @param node - The node to find related nodes for
   * @param workspace - The workspace
   * @returns Array of related nodes
   */
  public findOtherNodesWithSameVariant(
    node: Instance | Variant,
    workspace: Workspace,
  ): (Variant | Instance)[] {
    if (typeCheckingService.isVariant(node)) {
      return Object.values(workspace.byId).filter((candidate) => {
        return (
          typeCheckingService.isInstance(candidate) &&
          candidate.variant === node.id
        )
      })
    }

    return Object.values(workspace.byId).filter((candidate) => {
      return (
        (typeCheckingService.isInstance(candidate) &&
          candidate.variant === node.variant &&
          candidate.id !== node.id) ||
        (typeCheckingService.isVariant(candidate) &&
          candidate.id === node.variant)
      )
    })
  }

  /**
   * Checks if a node is a descendant of another node.
   * @param possibleParent - The potential parent node ID
   * @param subject - The subject node ID
   * @param workspace - The workspace
   * @returns True if the subject is a descendant of the parent
   */
  public isParentOfNode(
    possibleParent: InstanceId | VariantId,
    subject: InstanceId | VariantId,
    workspace: Workspace,
  ): boolean {
    if (possibleParent === subject) {
      return false
    }

    const parentNode = nodeRetrievalService.getNode(possibleParent, workspace)

    if (
      typeCheckingService.canNodeHaveChildren(parentNode) &&
      parentNode.children
    ) {
      const isDirectChild = parentNode.children.some(
        (childId) => childId === subject,
      )

      if (isDirectChild) {
        return true
      }

      for (const childId of parentNode.children) {
        if (this.isParentOfNode(childId, subject, workspace)) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Checks if a node is a direct child of a variant.
   * @param node - The node to check
   * @param workspace - The workspace
   * @returns True if the node is a direct child of a variant
   */
  public isDirectChildOfVariant(
    node: Variant | Instance,
    workspace: Workspace,
  ): node is Instance {
    if (!typeCheckingService.isInstance(node)) return false

    const parent = nodeTraversalService.findParentNode(node, workspace)
    if (!parent) return false

    return typeCheckingService.isVariant(parent)
  }

  /**
   * Gets the component name for a node or component ID.
   * @param nodeId - The node ID or component ID
   * @param workspace - The workspace
   * @returns The component name
   */
  public getComponentName(
    nodeId: InstanceId | VariantId | ComponentId,
    workspace: Workspace,
  ): string {
    try {
      const schema = getComponentSchema(nodeId as ComponentId)
      return schema.name
    } catch {
      try {
        const node = nodeRetrievalService.getNode(
          nodeId as InstanceId | VariantId,
          workspace,
        )
        const schema = getComponentSchema(node.component)
        return schema.name
      } catch {
        return "Unknown Component"
      }
    }
  }
}

export const nodeRelationshipService = new NodeRelationshipService()
