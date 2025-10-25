import { getComponentSchema } from "../../components/catalog"
import {
  ComponentId,
  ORDERED_COMPONENT_LEVELS,
} from "../../components/constants"
import {
  Board,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
} from "../types"
import { nodeRelationshipService } from "./node-relationship.service"
import { nodeRetrievalService } from "./node-retrieval.service"
import { nodeTraversalService } from "./node-traversal.service"
import { mutateWorkspace } from "./shared/workspace-mutation.helper"
import { typeCheckingService } from "./type-checking.service"

export type OperationResult<T = void> =
  | Workspace
  | (Record<string, any> & { workspace: Workspace; data?: T })

export class OperationPropagationService {
  /**
   * Propagates an operation across nodes based on propagation rules.
   * @param nodeId - The node ID to propagate from
   * @param propagation - The propagation type ("none", "downstream", "bidirectional")
   * @param apply - The function to apply to each node
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public propagateNodeOperation<OpResult extends OperationResult>({
    nodeId,
    propagation,
    apply,
    workspace,
  }: {
    nodeId: VariantId | InstanceId
    propagation: "none" | "downstream" | "bidirectional"
    apply: (
      node: Variant | Instance,
      workspace: Workspace,
      sourceResult?: OpResult,
    ) => OpResult
    workspace: Workspace
  }): Workspace {
    const node = nodeRetrievalService.getNode(nodeId, workspace)

    switch (propagation) {
      case "none":
        return this._applyWithoutPropagation(node, workspace, apply)
      case "downstream":
        return this._applyWithDownstreamPropagation(node, workspace, apply)
      case "bidirectional":
        return this._applyWithBidirectionalPropagation(node, workspace, apply)
      default:
        throw new Error(`Invalid propagation: ${propagation}`)
    }
  }

  /**
   * Checks if a node has an ancestor with the given component ID.
   * @param componentId - The component ID to search for
   * @param node - The node to check
   * @param workspace - The workspace
   * @returns True if an ancestor has the component ID
   */
  public hasAncestorWithComponentId(
    componentId: ComponentId,
    node: Variant | Instance | Board,
    workspace: Workspace,
  ): boolean {
    if (typeCheckingService.isBoard(node)) return node.id === componentId

    let parentNode: Variant | Instance | null = node

    while (parentNode) {
      if (parentNode.component === componentId) return true
      parentNode = nodeTraversalService.findParentNode(parentNode.id, workspace)
    }

    return false
  }

  /**
   * Sorts boards by component level hierarchy and updates their order.
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public realignBoardOrder(workspace: Workspace): Workspace {
    return mutateWorkspace(workspace, (draft) => {
      const boardEntries = Object.entries(draft.boards) as [
        ComponentId,
        Board,
      ][]

      boardEntries.sort(([aId, aBoard], [bId, bBoard]) => {
        try {
          const aSchema = getComponentSchema(aId)
          const bSchema = getComponentSchema(bId)

          const aLevelIndex = ORDERED_COMPONENT_LEVELS.indexOf(aSchema.level)
          const bLevelIndex = ORDERED_COMPONENT_LEVELS.indexOf(bSchema.level)

          if (aLevelIndex !== bLevelIndex) {
            return aLevelIndex - bLevelIndex
          }

          return aBoard.order - bBoard.order
        } catch (error) {
          return aBoard.order - bBoard.order
        }
      })

      boardEntries.forEach(([id, board], index) => {
        board.order = index
      })
    })
  }

  /**
   * Gets all boards sorted by their order.
   * @param workspace - The workspace
   * @returns Array of boards sorted by order
   */
  public getBoards(workspace: Workspace): Board[] {
    return Object.values(workspace.boards).sort((a, b) => a.order - b.order)
  }

  /**
   * Parses a JSON string into a workspace.
   * @param json - The JSON string
   * @returns The parsed workspace
   */
  public parseWorkspace(json: string): Workspace {
    return JSON.parse(json)
  }

  private _applyWithoutPropagation<OpResult extends OperationResult>(
    node: Variant | Instance,
    workspace: Workspace,
    apply: (
      node: Variant | Instance,
      workspace: Workspace,
      sourceResult?: OpResult,
    ) => OpResult,
  ): Workspace {
    const result = apply(node, workspace)
    return this._isWorkspace(result) ? result : result.workspace
  }

  private _applyWithDownstreamPropagation<OpResult extends OperationResult>(
    node: Variant | Instance,
    workspace: Workspace,
    apply: (
      node: Variant | Instance,
      workspace: Workspace,
      sourceResult?: OpResult,
    ) => OpResult,
  ): Workspace {
    const result = apply(node, workspace)
    const updatedWorkspace: Workspace = this._isWorkspace(result)
      ? result
      : result.workspace

    return this._propagateToInstances(node, updatedWorkspace, apply, result)
  }

  private _applyWithBidirectionalPropagation<OpResult extends OperationResult>(
    node: Variant | Instance,
    workspace: Workspace,
    apply: (
      node: Variant | Instance,
      workspace: Workspace,
      sourceResult?: OpResult,
    ) => OpResult,
  ): Workspace {
    const variant = typeCheckingService.isVariant(node)
      ? node
      : nodeRetrievalService.getVariant(node.variant, workspace)

    const result = apply(variant, workspace)
    const updatedWorkspace: Workspace = this._isWorkspace(result)
      ? result
      : result.workspace

    return this._propagateToInstances(variant, updatedWorkspace, apply, result)
  }

  private _propagateToInstances<OpResult extends OperationResult>(
    node: Variant | Instance,
    workspace: Workspace,
    apply: (
      node: Variant | Instance,
      workspace: Workspace,
      sourceResult?: OpResult,
    ) => OpResult,
    sourceResult?: OpResult,
  ): Workspace {
    const instances = nodeRelationshipService.findInstances(node, workspace)
    let updatedWorkspace = workspace

    for (const instance of instances) {
      const result = apply(instance, updatedWorkspace, sourceResult)
      updatedWorkspace = this._propagateToInstances(
        instance,
        this._isWorkspace(result) ? result : result.workspace,
        apply,
        result,
      )
    }

    return updatedWorkspace
  }

  private _isWorkspace(result: OperationResult): result is Workspace {
    return !("workspace" in result)
  }
}

export const operationPropagationService = new OperationPropagationService()
