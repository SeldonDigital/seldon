import { ComponentId } from "../../../components/constants"
import { Board, Instance, Variant, Workspace } from "../../types"

/**
 * Base interface for all workspace services.
 */
export interface BaseWorkspaceService {
  /**
   * The workspace instance being operated on.
   */
  workspace: Workspace
}

/**
 * Interface for services that need to retrieve nodes.
 */
export interface NodeRetrievalService extends BaseWorkspaceService {
  getNode(nodeId: string, workspace: Workspace): Variant | Instance
  getBoard(componentId: ComponentId, workspace: Workspace): Board
}

/**
 * Interface for services that perform type checking.
 */
export interface TypeCheckingService extends BaseWorkspaceService {
  isVariant(node: Variant | Instance | Board | undefined): node is Variant
  isInstance(node: Variant | Instance | Board | undefined): node is Instance
  isBoard(node: Variant | Instance | Board): node is Board
}

/**
 * Interface for services that handle node relationships.
 */
export interface NodeRelationshipService
  extends NodeRetrievalService,
    TypeCheckingService {
  findParentNode(
    child: Variant | Instance,
    workspace: Workspace,
  ): Variant | Instance | null
  findInstances(
    node: Variant | Instance,
    workspace: Workspace,
  ): (Variant | Instance)[]
}

/**
 * Interface for services that perform node operations.
 */
export interface NodeOperationsService extends NodeRelationshipService {
  insertNode(params: any, workspace: Workspace): any
  deleteNode(nodeId: string, workspace: Workspace): Workspace
  moveNode(nodeId: string, target: any, workspace: Workspace): Workspace
}

/**
 * Result type for operations that may return additional data.
 */
export type OperationResult<T = void> =
  | Workspace
  | (Record<string, any> & { workspace: Workspace; data?: T })
