import { ComponentId } from "../../../components/constants"
import { findParentNode as findParentNodeHelper } from "../../helpers/nodes/find-parent-node"
import { getChildIndex } from "../../helpers/nodes/get-child-index"
import { getComponentByNodeId } from "../../helpers/components/get-component-by-node-id"
import { getChildrenIds } from "../../helpers/components/get-children-ids"
import {
  Instance,
  InstanceId,
  NodePath,
  Variant,
  VariantId,
  Workspace,
} from "../../types"
import { parseNodeCatalog } from "../../model/template-ref"
import { nodeRetrievalService } from "./node-retrieval.service"
import { typeCheckingService } from "../type-checking/type-checking.service"

function nodeCatalogComponentId(node: Variant | Instance): ComponentId | null {
  const parsed = parseNodeCatalog(node.template)
  if (parsed?.kind === "catalog") {
    return parsed.componentId as ComponentId
  }
  return null
}

/**
 * Service for node traversal and path operations.
 */
export class NodeTraversalService {
  /**
   * Builds a path from the root variant to this instance using tree child indices.
   */
  public getNodePath(node: Variant | Instance, workspace: Workspace): NodePath {
    const path: NodePath = []

    if (typeCheckingService.isVariant(node)) {
      return path
    }

    let currentId: InstanceId = node.id
    while (true) {
      const parent = findParentNodeHelper(currentId, workspace)
      if (!parent) break

      const componentId = nodeCatalogComponentId(
        nodeRetrievalService.getNode(currentId, workspace) as Instance,
      )
      if (!componentId) break

      const index = getChildIndex(currentId, workspace)
      path.unshift({ componentId, index })

      if (typeCheckingService.isVariant(parent)) {
        break
      }

      currentId = parent.id as InstanceId
    }

    return path
  }

  /**
   * Follows a path under a root variant using the board composition tree.
   */
  public findNodeByPath(
    nodeToSearchIn: Variant | Instance,
    path: NodePath,
    workspace: Workspace,
  ): Variant | Instance | null {
    let currentNode = nodeToSearchIn

    for (const segment of path) {
      const board = getComponentByNodeId(workspace, currentNode.id)
      if (!board) return null

      const childIds = getChildrenIds(board, currentNode.id)
      const childId = childIds[segment.index]
      if (!childId) return null

      const child = nodeRetrievalService.getNode(childId, workspace)
      const childComponentId = nodeCatalogComponentId(child as Variant | Instance)
      if (childComponentId !== segment.componentId) return null

      currentNode = child as Variant | Instance
    }

    return currentNode
  }

  /**
   * Finds the parent entry node using the board variant tree.
   */
  public findParentNode(
    child: Variant | Instance | VariantId | InstanceId,
    workspace: Workspace,
  ): Variant | Instance | null {
    const childId =
      typeof child === "string" ? child : (child.id as VariantId | InstanceId)
    return findParentNodeHelper(childId, workspace)
  }
}

export const nodeTraversalService = new NodeTraversalService()
