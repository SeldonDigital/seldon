import { getComponentSchema } from "../../../components/catalog"
import {
  ComponentId,
  ComponentLevel,
  isComponentId,
  ORDERED_COMPONENT_LEVELS,
} from "../../../components/constants"
import { invariant } from "../../../index"
import {
  getComponentOrder,
  setComponentOrder,
} from "../../helpers/components/component-sort-order"
import { componentBoardDefaultNodeId } from "../../helpers/components/entry-node-ids"
import {
  ComponentEntry,
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
  if (!isEntryNodeForRules(node)) {
    return (node as { component?: ComponentId }).component
  }
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
  if (isEntryNodeForRules(node)) {
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
  const legacyVariant = (node as { variant?: string }).variant
  if (typeof legacyVariant === "string") {
    return legacyVariant as VariantId
  }
  throw new Error("Expected variant root id on instance")
}

export type OperationResult<T = void> =
  | Workspace
  | (Record<string, any> & { workspace: Workspace; data?: T })

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
    node: Variant | Instance | ComponentEntry,
    workspace: Workspace,
  ): boolean {
    if (typeCheckingService.isComponentEntry(node)) {
      return node.type === "component" && node.catalogId === componentId
    }

    let parentNode: Variant | Instance | null = node

    while (parentNode) {
      if (propagationNodeComponentId(parentNode) === componentId) return true
      parentNode = nodeTraversalService.findParentNode(parentNode.id, workspace)
    }

    return false
  }

  /**
   * Sorts boards by component level hierarchy and updates their order.
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public realignComponentOrder(workspace: Workspace): Workspace {
    return mutateWorkspace(workspace, (draft) => {
      const boardEntries = Object.entries(draft.components) as [
        ComponentId,
        ComponentEntry,
      ][]

      boardEntries.sort(([aId, aBoard], [bId, bBoard]) => {
        try {
          const aSchema = getComponentSchema(aId)
          const bSchema = getComponentSchema(bId)

          // Handle BOARD level as a special case - boards live outside the component hierarchy
          // and should be sorted after all regular component levels
          const getLevelIndex = (level: ComponentLevel): number => {
            const index = ORDERED_COMPONENT_LEVELS.indexOf(level)
            return index === -1 ? ORDERED_COMPONENT_LEVELS.length : index
          }

          const aLevelIndex = getLevelIndex(aSchema.level)
          const bLevelIndex = getLevelIndex(bSchema.level)

          if (aLevelIndex !== bLevelIndex) {
            return aLevelIndex - bLevelIndex
          }

          return getComponentOrder(aBoard) - getComponentOrder(bBoard)
        } catch (error) {
          return getComponentOrder(aBoard) - getComponentOrder(bBoard)
        }
      })

      boardEntries.forEach(([id, board], index) => {
        setComponentOrder(board, index)
      })
    })
  }

  /**
   * Gets all boards sorted by their order.
   * @param workspace - The workspace
   * @returns Array of boards sorted by order
   */
  public getComponents(workspace: Workspace): ComponentEntry[] {
    return Object.values(workspace.components).sort(
      (a, b) => getComponentOrder(a) - getComponentOrder(b),
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
