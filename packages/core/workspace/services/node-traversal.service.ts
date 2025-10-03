import {
  Instance,
  InstanceId,
  NodePath,
  Variant,
  VariantId,
  Workspace,
} from "../types"
import { nodeRetrievalService } from "./node-retrieval.service"
import { typeCheckingService } from "./type-checking.service"

/**
 * Service for node traversal and path operations.
 */
export class NodeTraversalService {
  /**
   * Gets the path from root variant to the given node.
   * @param node - The node to get the path for
   * @param workspace - The workspace
   * @returns The path to the node
   */
  public getNodePath(node: Variant | Instance, workspace: Workspace): NodePath {
    const path: NodePath = []

    if (typeCheckingService.isVariant(node)) {
      return path
    }

    let child = node
    let parent = this.findParentNode(node, workspace)
    while (parent) {
      const index = parent.children?.indexOf(child.id)
      if (index !== undefined) {
        path.unshift({ componentId: child.component, index })
      }
      if (typeCheckingService.isVariant(parent)) {
        break
      }

      child = parent
      parent = this.findParentNode(child, workspace)
    }

    return path
  }

  /**
   * Finds a node within another node by following a path.
   * @param nodeToSearchIn - The node to search within
   * @param path - The path to the target node
   * @param workspace - The workspace
   * @returns The found node, or null if not found
   */
  public findNodeByPath(
    nodeToSearchIn: Variant | Instance,
    path: NodePath,
    workspace: Workspace,
  ): Variant | Instance | null {
    let currentNode = nodeToSearchIn

    for (const segment of path) {
      if (!currentNode.children) return null

      const childId = currentNode.children[segment.index]
      if (!childId) return null

      const child = nodeRetrievalService.getNode(childId, workspace)
      if (child.component !== segment.componentId) return null

      currentNode = child
    }

    return currentNode
  }

  /**
   * Finds the parent of a node.
   * @param child - The child node or node ID
   * @param workspace - The workspace
   * @returns The parent node, or null if not found
   */
  public findParentNode(
    child: Variant | Instance | VariantId | InstanceId,
    workspace: Workspace,
  ): Variant | Instance | null {
    const childNode =
      typeof child === "string"
        ? nodeRetrievalService.getNode(child, workspace)
        : child

    if (typeCheckingService.isVariant(childNode)) {
      return null
    }

    for (const id in workspace.byId) {
      const possibleParent = workspace.byId[id]
      if (
        possibleParent.children &&
        possibleParent.children.includes(childNode.id as InstanceId)
      ) {
        return possibleParent
      }
    }
    return null
  }
}

export const nodeTraversalService = new NodeTraversalService()
