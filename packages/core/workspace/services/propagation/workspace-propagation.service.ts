import {
  EntryNodeId,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
} from "../../types"
import {
  OperationResult,
  propagateNodeOperation,
  propagatePositionalChildOperation,
} from "./propagate-node-operation"

export type { OperationResult }

/** Facade over the node-operation propagation engine. */
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

  /**
   * Applies an operation to a child node and to the positionally matching child
   * inside every instance of that child's parent.
   */
  public propagatePositionalChildOperation(args: {
    childId: VariantId | InstanceId
    propagation: "none" | "downstream" | "bidirectional"
    applyToChild: (childId: EntryNodeId, workspace: Workspace) => Workspace
    workspace: Workspace
  }): Workspace {
    return propagatePositionalChildOperation(args)
  }

  /** Parses a JSON string into a workspace. */
  public parseWorkspace(json: string): Workspace {
    return JSON.parse(json)
  }
}

export const workspacePropagationService = new WorkspacePropagationService()
