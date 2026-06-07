import { ComponentId } from "../../../components/constants"
import { Board, Instance, InstanceId, Variant, VariantId, Workspace } from "../../types"
import { getBoards, realignBoardOrder } from "./board-order"
import { hasAncestorWithComponentId } from "./has-ancestor-with-component-id"
import {
  OperationResult,
  propagateNodeOperation,
} from "./propagate-node-operation"

export type { OperationResult }

/**
 * Facade over workspace propagation operations. Each method delegates to a
 * topical module: the propagation engine, board ordering, and ancestry queries.
 */
export class WorkspacePropagationService {
  /** Applies an operation to a node and propagates it across instances per the propagation mode. */
  public propagateNodeOperation<OpResult extends OperationResult>(args: {
    nodeId: VariantId | InstanceId
    propagation: "none" | "downstream" | "bidirectional"
    apply: (
      node: Variant | Instance,
      workspace: Workspace,
      sourceResult?: OpResult,
    ) => OpResult
    workspace: Workspace
  }): Workspace {
    return propagateNodeOperation(args)
  }

  /** True when the node, or any of its ancestors, maps to the given component id. */
  public hasAncestorWithComponentId(
    componentId: ComponentId,
    node: Variant | Instance | Board,
    workspace: Workspace,
  ): boolean {
    return hasAncestorWithComponentId(componentId, node, workspace)
  }

  /** Sorts boards by component level then label and rewrites their stored order. */
  public realignBoardOrder(workspace: Workspace): Workspace {
    return realignBoardOrder(workspace)
  }

  /** All boards sorted by their stored order. */
  public getBoards(workspace: Workspace): Board[] {
    return getBoards(workspace)
  }

  /** Parses a JSON string into a workspace. */
  public parseWorkspace(json: string): Workspace {
    return JSON.parse(json)
  }
}

export const workspacePropagationService = new WorkspacePropagationService()
