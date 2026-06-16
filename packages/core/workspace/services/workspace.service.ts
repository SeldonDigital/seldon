import { ComponentId } from "../../components/constants"
import { Properties, PropertyKey, SubPropertyKey } from "../../properties"
import { Entity, Propagation } from "../../rules/types/rule-config-types"
import { ThemeInstanceId } from "../../themes/types"
import {
  Board,
  BoardKey,
  DefaultVariant,
  Instance,
  InstanceId,
  NodePath,
  RulesNodeOrComponent,
  UserVariant,
  Variant,
  VariantId,
  Workspace,
} from "../types"
import { boardOrderService } from "./components/board-order.service"
import { workspaceMutationService } from "./mutation/workspace-mutation.service"
import { nodeOperationsService } from "./nodes/node-operations.service"
import { nodeRelationshipService } from "./nodes/node-relationship.service"
import { nodeRetrievalService } from "./nodes/node-retrieval.service"
import { nodeTraversalService } from "./nodes/node-traversal.service"
import {
  type OperationResult,
  workspacePropagationService,
} from "./propagation/workspace-propagation.service"
import { typeCheckingService } from "./type-checking/type-checking.service"

/**
 * Legacy WorkspaceService class for backward compatibility.
 * All methods delegate to specialized services.
 * @deprecated Use individual services directly for new code
 */
class WorkspaceService {
  public getBoard(boardKey: BoardKey, workspace: Workspace): Board {
    return nodeRetrievalService.getBoard(boardKey, workspace)
  }

  public getNode(
    nodeId: InstanceId | VariantId,
    workspace: Workspace,
  ): Variant | Instance {
    return nodeRetrievalService.getNode(nodeId, workspace)
  }

  public getObject(
    objectId: InstanceId | VariantId | ComponentId,
    workspace: Workspace,
  ): Variant | Instance | Board {
    return nodeRetrievalService.getObject(objectId, workspace)
  }

  public getNodes(workspace: Workspace): (Variant | Instance)[] {
    return nodeRetrievalService.getNodes(workspace)
  }

  public getVariant(variantId: VariantId, workspace: Workspace): Variant {
    return nodeRetrievalService.getVariant(variantId, workspace)
  }

  public getDefaultVariant(
    componentId: ComponentId,
    workspace: Workspace,
  ): Variant {
    return nodeRetrievalService.getDefaultVariant(componentId, workspace)
  }

  public getInstance(instanceId: InstanceId, workspace: Workspace): Instance {
    return nodeRetrievalService.getInstance(instanceId, workspace)
  }

  public getNodePath(node: Variant | Instance, workspace: Workspace): NodePath {
    return nodeTraversalService.getNodePath(node, workspace)
  }

  public findNodeByPath(
    nodeToSearchIn: Variant | Instance,
    path: NodePath,
    workspace: Workspace,
  ): Variant | Instance | null {
    return nodeTraversalService.findNodeByPath(nodeToSearchIn, path, workspace)
  }

  public getEntityType(nodeOrBoard: RulesNodeOrComponent): Entity {
    return typeCheckingService.getEntityType(nodeOrBoard)
  }

  public isInstance(node: RulesNodeOrComponent | undefined): node is Instance {
    return typeCheckingService.isInstance(node)
  }

  public isVariant(node: RulesNodeOrComponent | undefined): node is Variant {
    return typeCheckingService.isVariant(node)
  }

  public isDefaultVariant(node: RulesNodeOrComponent): node is DefaultVariant {
    return typeCheckingService.isDefaultVariant(node)
  }

  public isUserVariant(node: RulesNodeOrComponent): node is UserVariant {
    return typeCheckingService.isUserVariant(node)
  }

  public isBoard(node: RulesNodeOrComponent | undefined): node is Board {
    return node !== undefined && typeCheckingService.isBoard(node)
  }

  public isNode(node: RulesNodeOrComponent): node is Variant | Instance {
    return typeCheckingService.isNode(node)
  }

  public isDirectChildOfVariant(
    node: Variant | Instance,
    workspace: Workspace,
  ): node is Instance {
    return nodeRelationshipService.isDirectChildOfVariant(node, workspace)
  }

  public isSchemaDefinedInstance(node: Instance): boolean {
    return typeCheckingService.isSchemaDefinedInstance(node)
  }

  public canNodeHaveChildren(node: RulesNodeOrComponent): boolean {
    return typeCheckingService.canNodeHaveChildren(node)
  }

  public getInstanceIndex(node: Instance, workspace: Workspace): number {
    return nodeRelationshipService.getInstanceIndex(node, workspace)
  }

  public getVariantIndex(node: Variant, workspace: Workspace): number {
    return nodeRelationshipService.getVariantIndex(node, workspace)
  }

  public findAdjacent(
    node: Instance | Variant,
    placement: "before" | "after",
    workspace: Workspace,
  ): Instance | Variant | null {
    return nodeRelationshipService.findAdjacent(node, placement, workspace)
  }

  public findAdjacentNode(
    node: Instance,
    placement: "before" | "after",
    workspace: Workspace,
  ): Instance | null {
    return nodeRelationshipService.findAdjacentNode(node, placement, workspace)
  }

  public findAdjacentVariant(
    node: Variant,
    placement: "before" | "after",
    workspace: Workspace,
  ): Variant | null {
    return nodeRelationshipService.findAdjacentVariant(
      node,
      placement,
      workspace,
    )
  }

  public findBoardForVariant(
    variant: Variant,
    workspace: Workspace,
  ): Board | null {
    return nodeRelationshipService.findBoardForVariant(variant, workspace)
  }

  public findBoardForNode(
    node: Variant | Instance,
    workspace: Workspace,
  ): Board | null {
    return nodeRelationshipService.findBoardForNode(node, workspace)
  }

  public findContainerNode(
    node: Variant | Instance | VariantId | InstanceId,
    workspace: Workspace,
  ): Variant | Instance {
    return nodeRelationshipService.findContainerNode(node, workspace)
  }

  public findParentNode(
    child: Variant | Instance | VariantId | InstanceId,
    workspace: Workspace,
  ): Variant | Instance | null {
    return nodeTraversalService.findParentNode(child, workspace)
  }

  public getRootVariant(
    node: Variant | Instance,
    workspace: Workspace,
  ): Variant {
    return nodeRelationshipService.getRootVariant(node, workspace)
  }

  public areWithinSameVariant(
    node: Variant | Instance,
    otherNode: Variant | Instance,
    workspace: Workspace,
  ): boolean {
    return nodeRelationshipService.areWithinSameVariant(
      node,
      otherNode,
      workspace,
    )
  }

  public findInstances(
    node: Variant | Instance,
    workspace: Workspace,
  ): (Variant | Instance)[] {
    return nodeRelationshipService.findInstances(node, workspace)
  }

  public findOtherNodesWithSameVariant(
    node: Instance | Variant,
    workspace: Workspace,
  ): (Variant | Instance)[] {
    return nodeRelationshipService.findOtherNodesWithSameVariant(
      node,
      workspace,
    )
  }

  public isParentOfNode(
    possibleParent: InstanceId | VariantId,
    subject: InstanceId | VariantId,
    workspace: Workspace,
  ): boolean {
    return nodeRelationshipService.isParentOfNode(
      possibleParent,
      subject,
      workspace,
    )
  }

  public getComponentName(
    nodeId: InstanceId | VariantId | ComponentId,
    workspace: Workspace,
  ): string {
    return nodeRelationshipService.getComponentName(nodeId, workspace)
  }

  public canComponentBeParentOf(
    parentId: ComponentId,
    childId: ComponentId,
  ): boolean {
    return typeCheckingService.canComponentBeParentOf(parentId, childId)
  }

  /**
   * Inserts a node into another node at a specific position.
   * @param params - Insertion parameters
   * @param workspace - The workspace to modify
   * @returns Updated workspace and the ID of the created node
   */
  public insertNode(
    params: {
      nodeId: VariantId | InstanceId
      parentId: VariantId | InstanceId
      parentIndex?: number
    },
    workspace: Workspace,
  ): { workspace: Workspace; createdNodeId: InstanceId } {
    return nodeOperationsService.insertNode(params, workspace)
  }

  public deleteBoard(
    componentId: ComponentId,
    workspace: Workspace,
  ): Workspace {
    return nodeOperationsService.deleteBoard(componentId, workspace)
  }

  public deleteBoardByKey(boardKey: BoardKey, workspace: Workspace): Workspace {
    return nodeOperationsService.deleteBoardByKey(boardKey, workspace)
  }

  public deleteInstance(
    instanceId: InstanceId,
    workspace: Workspace,
  ): Workspace {
    return nodeOperationsService.deleteInstance(instanceId, workspace)
  }

  /**
   * Moves a node to a new parent and position.
   * @param nodeId - The node to move
   * @param newPosition - New position parameters
   * @param workspace - The workspace to modify
   * @returns Updated workspace
   */
  public moveInstance(
    instanceId: InstanceId,
    newPosition: {
      parentId: VariantId | InstanceId
      index: number
    },
    workspace: Workspace,
  ): Workspace {
    return nodeOperationsService.moveInstance(
      instanceId,
      newPosition,
      workspace,
    )
  }

  public deleteVariant(variantId: VariantId, workspace: Workspace): Workspace {
    return nodeOperationsService.deleteVariant(variantId, workspace)
  }

  public duplicateNode(
    nodeId: VariantId | InstanceId,
    workspace: Workspace,
  ): Workspace {
    return nodeOperationsService.duplicateNode(nodeId, workspace)
  }

  public moveInstanceToIndex(
    node: Variant | Instance,
    index: number,
    workspace: Workspace,
  ): Workspace {
    return nodeOperationsService.moveInstanceToIndex(node, index, workspace)
  }

  public reorderVariantIndex(
    node: Variant | Instance,
    index: number,
    workspace: Workspace,
  ): Workspace {
    return nodeOperationsService.reorderVariantIndex(node, index, workspace)
  }

  public setNodeLabel(
    nodeId: VariantId | InstanceId,
    label: string,
    workspace: Workspace,
  ): Workspace {
    return workspaceMutationService.setNodeLabel(nodeId, label, workspace)
  }

  public setNodeEditorData(
    nodeId: VariantId | InstanceId,
    editorData: Record<string, unknown> | undefined,
    workspace: Workspace,
  ): Workspace {
    return workspaceMutationService.setNodeEditorData(
      nodeId,
      editorData,
      workspace,
    )
  }

  public getInitialVariantLabel(
    componentId: ComponentId,
    workspace: Workspace,
  ): string {
    return workspaceMutationService.getInitialVariantLabel(
      componentId,
      workspace,
    )
  }

  public getInitialComponentLabel(componentId: ComponentId): string {
    return workspaceMutationService.getInitialComponentLabel(componentId)
  }

  /**
   * Sets properties on a node.
   * @param nodeId - The node to update
   * @param properties - The properties to set
   * @param workspace - The workspace to modify
   * @param options - Optional configuration
   * @returns Updated workspace
   */
  public setNodeProperties(
    nodeId: VariantId | InstanceId,
    properties: Properties,
    workspace: Workspace,
    options?: {
      mergeSubProperties?: boolean
    },
  ): Workspace {
    return workspaceMutationService.setNodeProperties(
      nodeId,
      properties,
      workspace,
      options,
    )
  }

  /**
   * Resets a specific property on a node to its default value.
   * @param nodeId - The node to update
   * @param params - Reset parameters
   * @param workspace - The workspace to modify
   * @returns Updated workspace
   */
  public resetNodeProperty(
    nodeId: VariantId | InstanceId,
    params: {
      propertyKey: PropertyKey
      subpropertyKey?: SubPropertyKey
    },
    workspace: Workspace,
  ): Workspace {
    return workspaceMutationService.resetNodeProperty(nodeId, params, workspace)
  }

  public setComponentProperties(
    boardKey: BoardKey,
    properties: Properties,
    workspace: Workspace,
  ): Workspace {
    return workspaceMutationService.setComponentProperties(
      boardKey,
      properties,
      workspace,
    )
  }

  public resetComponentProperty(
    boardKey: BoardKey,
    params: {
      propertyKey: PropertyKey
      subpropertyKey?: SubPropertyKey
    },
    workspace: Workspace,
  ): Workspace {
    return workspaceMutationService.resetComponentProperty(
      boardKey,
      params,
      workspace,
    )
  }

  public resetUserVariantToDefaultVariant(
    variantRootId: VariantId,
    workspace: Workspace,
  ): Workspace {
    return workspaceMutationService.resetUserVariantToDefaultVariant(
      variantRootId,
      workspace,
    )
  }

  public setComponentTheme(
    boardKey: BoardKey,
    theme: ThemeInstanceId,
    workspace: Workspace,
  ): Workspace {
    return workspaceMutationService.setComponentTheme(
      boardKey,
      theme,
      workspace,
    )
  }

  public setNodeTheme(
    nodeId: VariantId | InstanceId,
    theme: ThemeInstanceId | null,
    workspace: Workspace,
  ): Workspace {
    return workspaceMutationService.setNodeTheme(nodeId, theme, workspace)
  }

  public getNodeTheme(
    node: Variant | Instance,
    workspace: Workspace,
  ): ThemeInstanceId {
    return workspaceMutationService.getNodeTheme(node, workspace)
  }

  public getInheritedTheme(
    node: Variant | Instance,
    workspace: Workspace,
  ): ThemeInstanceId {
    return workspaceMutationService.getInheritedTheme(node, workspace)
  }

  /**
   * Propagates an operation across multiple nodes based on propagation rules.
   * @param params - Propagation parameters
   * @returns Updated workspace
   */
  public propagateNodeOperation<OpResult extends OperationResult>({
    nodeId,
    propagation,
    apply,
    workspace,
  }: {
    nodeId: VariantId | InstanceId
    propagation: Propagation
    apply: (
      node: Variant | Instance,
      workspace: Workspace,
      sourceResult?: OpResult,
    ) => OpResult
    workspace: Workspace
  }): Workspace {
    return workspacePropagationService.propagateNodeOperation({
      nodeId,
      propagation,
      apply,
      workspace,
    })
  }

  public hasAncestorWithComponentId(
    componentId: ComponentId,
    node: Variant | Instance | Board,
    workspace: Workspace,
  ): boolean {
    return nodeRelationshipService.hasAncestorWithComponentId(
      componentId,
      node,
      workspace,
    )
  }

  public realignBoardOrder(workspace: Workspace): Workspace {
    return boardOrderService.realignBoardOrder(workspace)
  }

  public getBoards(workspace: Workspace): Board[] {
    return boardOrderService.getBoards(workspace)
  }

  public getPlaygrounds(workspace: Workspace): Board[] {
    return boardOrderService.getPlaygrounds(workspace)
  }

  public parseWorkspace(json: string): Workspace {
    return workspacePropagationService.parseWorkspace(json)
  }
}

export const workspaceService = new WorkspaceService()

export type {
  Board,
  DefaultVariant,
  Instance,
  InstanceId,
  NodePath,
  UserVariant,
  Variant,
  VariantId,
  Workspace,
} from "../types"
