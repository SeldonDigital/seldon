import { getComponentSchema } from "../../../components/catalog"
import { ComponentId, isComponentId } from "../../../components/constants"
import { invariant } from "../../../index"
import { ErrorMessages } from "../../constants"
import { getBoardByNodeId } from "../../helpers/components/get-board-by-node-id"
import { getChildrenIds } from "../../helpers/components/get-children-ids"
import { getImmediateParentIdInWorkspace } from "../../helpers/components/get-node-parent-id"
import { isEntryNodeForRules } from "../../helpers/rules/rules-node-subject"
import { parseNodeCatalog, parseNodeLink } from "../../model/template-ref"
import {
  Board,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
} from "../../types"
import { withParentNode } from "../shared/workspace-operation-helpers"
import { typeCheckingService } from "../type-checking/type-checking.service"
import { nodeRetrievalService } from "./node-retrieval.service"
import { nodeTraversalService } from "./node-traversal.service"

function templateSourceNodeId(node: Variant | Instance): string | null {
  if (!isEntryNodeForRules(node)) return null
  const link = parseNodeLink((node as { template: string }).template)
  return link?.kind === "node" ? link.nodeId : null
}

function nodeCatalogComponentId(node: Variant | Instance): ComponentId | null {
  const parsed = parseNodeCatalog(node.template)
  if (parsed?.kind === "catalog" && isComponentId(parsed.componentId)) {
    return parsed.componentId
  }
  return null
}

/**
 * Service for managing node relationships and hierarchy operations.
 */
export class NodeRelationshipService {
  public getInstanceIndex(node: Instance, workspace: Workspace): number {
    const { result } = withParentNode(node, workspace, (parent) => {
      const board = getBoardByNodeId(workspace, parent.id)
      invariant(board, `Board not found for parent ${parent.id}`)
      const childIds = getChildrenIds(board, parent.id)
      return childIds.indexOf(node.id)
    })
    return result
  }

  public getVariantIndex(node: Variant, workspace: Workspace): number {
    const board = this.findBoardForVariant(node, workspace)
    invariant(board, ErrorMessages.componentNotFoundForVariant(node.id))

    return board.variants.findIndex((ref) => ref.id === node.id)
  }

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

  public findAdjacentNode(
    node: Instance,
    placement: "before" | "after",
    workspace: Workspace,
  ): Instance | null {
    const ownIndex = this.getInstanceIndex(node, workspace)
    const targetIndex = placement === "before" ? ownIndex - 1 : ownIndex + 1

    const { result } = withParentNode(node, workspace, (parent) => {
      const board = getBoardByNodeId(workspace, parent.id)
      if (!board) return null

      const childIds = getChildrenIds(board, parent.id)
      if (targetIndex < 0 || targetIndex >= childIds.length) return null

      const targetId = childIds[targetIndex]
      const child = nodeRetrievalService.getNode(targetId, workspace)
      return typeCheckingService.isInstance(child) ? child : null
    })
    return result
  }

  private findAdjacentVariant(
    node: Variant,
    placement: "before" | "after",
    workspace: Workspace,
  ): Variant | null {
    const ownIndex = this.getVariantIndex(node, workspace)
    const targetIndex = placement === "before" ? ownIndex - 1 : ownIndex + 1

    const board = this.findBoardForVariant(node, workspace)
    if (!board) return null

    const refs = board.variants
    if (targetIndex < 0 || targetIndex >= refs.length) return null

    const targetRef = refs[targetIndex]
    const child = nodeRetrievalService.getNode(targetRef.id, workspace)
    return typeCheckingService.isVariant(child) ? child : null
  }

  public findBoardForVariant(
    variant: Variant,
    workspace: Workspace,
  ): Board | null {
    return getBoardByNodeId(workspace, variant.id)
  }

  public findBoardForNode(
    node: Variant | Instance,
    workspace: Workspace,
  ): Board | null {
    return getBoardByNodeId(workspace, node.id)
  }

  public findContainerNode(
    node: Variant | Instance | VariantId | InstanceId,
    workspace: Workspace,
  ): Variant | Instance {
    let currentNode =
      typeof node === "string"
        ? nodeRetrievalService.getNode(node, workspace)
        : node

    while (currentNode) {
      if (typeCheckingService.canNodeHaveChildren(currentNode, workspace)) {
        return currentNode
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

  public getRootVariant(
    node: Variant | Instance,
    workspace: Workspace,
  ): Variant {
    let currentNode: Variant | Instance = node

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

  public findInstances(
    node: Variant | Instance,
    workspace: Workspace,
  ): (Variant | Instance)[] {
    const sourceId = node.id
    return Object.values(workspace.nodes).filter((row) => {
      return (
        typeCheckingService.isInstance(row) &&
        templateSourceNodeId(row) === sourceId
      )
    })
  }

  public isParentOfNode(
    possibleParent: InstanceId | VariantId,
    subject: InstanceId | VariantId,
    workspace: Workspace,
  ): boolean {
    if (possibleParent === subject) {
      return false
    }

    let currentId: InstanceId | VariantId = subject

    while (true) {
      const parentId = getImmediateParentIdInWorkspace(workspace, currentId)
      if (!parentId) return false
      if (parentId === possibleParent) return true

      currentId = parentId as InstanceId | VariantId
    }
  }

  public isDirectChildOfVariant(
    node: Variant | Instance,
    workspace: Workspace,
  ): node is Instance {
    if (!typeCheckingService.isInstance(node)) return false

    const parent = nodeTraversalService.findParentNode(node, workspace)
    if (!parent) return false

    return typeCheckingService.isVariant(parent)
  }

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
        const componentId = nodeCatalogComponentId(node)
        if (componentId) {
          return getComponentSchema(componentId).name
        }
      } catch {
        return "Unknown Component"
      }
      return "Unknown Component"
    }
  }

  /** True when the node, or any of its ancestors, maps to the given component id. */
  public hasAncestorWithComponentId(
    componentId: ComponentId,
    node: Variant | Instance | Board,
    workspace: Workspace,
  ): boolean {
    if (typeCheckingService.isBoard(node)) {
      return node.type === "component" && node.catalogId === componentId
    }

    let parentNode: Variant | Instance | null = node
    while (parentNode) {
      if (
        isEntryNodeForRules(parentNode) &&
        nodeCatalogComponentId(parentNode) === componentId
      ) {
        return true
      }
      parentNode = nodeTraversalService.findParentNode(parentNode.id, workspace)
    }

    return false
  }
}

export const nodeRelationshipService = new NodeRelationshipService()
