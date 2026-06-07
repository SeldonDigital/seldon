import { getComponentSchema } from "../../../components/catalog"
import {
  ComponentId,
  ComponentLevel,
  isComponentId,
  ORDERED_COMPONENT_LEVELS,
} from "../../../components/constants"
import { invariant } from "../../../index"
import {
  getBoardOrder,
  setBoardOrder,
} from "../../helpers/components/board-sort-order"
import { componentBoardDefaultNodeId } from "../../helpers/components/entry-node-ids"
import { isComponentBoard } from "../../model/components"
import {
  Board,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
} from "../../types"
import { isEntryNodeForRules } from "../../helpers/rules/rules-node-subject"
import { parseNodeCatalog, parseNodeLink } from "../../model/template-ref"
import { nodeRelationshipService } from "../nodes/node-relationship.service"
import { nodeRetrievalService } from "../nodes/node-retrieval.service"
import { nodeTraversalService } from "../nodes/node-traversal.service"
import { mutateWorkspace } from "../shared/workspace-mutation.helper"
import { typeCheckingService } from "../type-checking/type-checking.service"

function propagationNodeComponentId(
  node: Variant | Instance,
): ComponentId | undefined {
  if (!isEntryNodeForRules(node)) return undefined
  const parsed = parseNodeCatalog(node.template)
  if (parsed?.kind === "catalog" && isComponentId(parsed.componentId)) {
    return parsed.componentId
  }
  return undefined
}

function instancePropagationVariantRootId(node: Variant | Instance): VariantId {
  if (typeCheckingService.isVariant(node)) {
    return node.id as VariantId
  }
  invariant(isEntryNodeForRules(node), "Expected variant root id on instance")

  const link = parseNodeLink(node.template)
  if (link?.kind === "node") {
    return link.nodeId as VariantId
  }

  const cat = parseNodeCatalog(node.template)
  invariant(
    cat?.kind === "catalog",
    "Expected catalog or node template on instance",
  )
  return componentBoardDefaultNodeId(cat.componentId) as VariantId
}

export type OperationResult<T = void> =
  | Workspace
  | (Record<string, any> & { workspace: Workspace; data?: T })

/** Position of a component level in the ordered hierarchy; unknown levels sort last. */
function componentLevelIndex(level: ComponentLevel): number {
  const index = ORDERED_COMPONENT_LEVELS.indexOf(level)
  return index === -1 ? ORDERED_COMPONENT_LEVELS.length : index
}

/**
 * Orders boards by component level, then component boards alphabetically by label.
 * Boards without a registered component schema keep their stored order.
 */
function compareBoardOrder(
  aId: ComponentId,
  aBoard: Board,
  bId: ComponentId,
  bBoard: Board,
): number {
  try {
    const aLevelIndex = componentLevelIndex(getComponentSchema(aId).level)
    const bLevelIndex = componentLevelIndex(getComponentSchema(bId).level)
    if (aLevelIndex !== bLevelIndex) {
      return aLevelIndex - bLevelIndex
    }
    if (isComponentBoard(aBoard) && isComponentBoard(bBoard)) {
      return aBoard.label.localeCompare(bBoard.label)
    }
  } catch {
    // Fall through to stored order below.
  }
  return getBoardOrder(aBoard) - getBoardOrder(bBoard)
}

export class WorkspacePropagationService {
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
    if (typeCheckingService.isBoard(node)) {
      return node.type === "component" && node.catalogId === componentId
    }

    let parentNode: Variant | Instance | null = node

    while (parentNode) {
      if (propagationNodeComponentId(parentNode) === componentId) return true
      parentNode = nodeTraversalService.findParentNode(parentNode.id, workspace)
    }

    return false
  }

  /** Sorts boards by component level then label and rewrites their stored order. */
  public realignBoardOrder(workspace: Workspace): Workspace {
    return mutateWorkspace(workspace, (draft) => {
      const boardEntries = Object.entries(draft.components) as [
        ComponentId,
        Board,
      ][]

      boardEntries.sort(([aId, aBoard], [bId, bBoard]) =>
        compareBoardOrder(aId, aBoard, bId, bBoard),
      )

      boardEntries.forEach(([, board], index) => setBoardOrder(board, index))
    })
  }

  /**
   * Gets all boards sorted by their order.
   * @param workspace - The workspace
   * @returns Array of boards sorted by order
   */
  public getBoards(workspace: Workspace): Board[] {
    return Object.values(workspace.components).sort(
      (a, b) => getBoardOrder(a) - getBoardOrder(b),
    )
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
      : nodeRetrievalService.getVariant(
          instancePropagationVariantRootId(node),
          workspace,
        )

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

export const workspacePropagationService = new WorkspacePropagationService()
