import { invariant } from "../../../index"
import { componentBoardDefaultNodeId } from "../../helpers/components/entry-node-ids"
import { getBoardByNodeId } from "../../helpers/components/get-board-by-node-id"
import { getChildrenIds } from "../../helpers/components/get-children-ids"
import { findParentNode } from "../../helpers/nodes/find-parent-node"
import { getChildIndex } from "../../helpers/nodes/get-child-index"
import { isEntryNodeForRules } from "../../helpers/rules/rules-node-subject"
import { parseNodeCatalog, parseNodeLink } from "../../model/template-ref"
import {
  EntryNodeId,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
} from "../../types"
import { nodeRelationshipService } from "../nodes/node-relationship.service"
import { nodeRetrievalService } from "../nodes/node-retrieval.service"
import { typeCheckingService } from "../type-checking/type-checking.service"

export type OperationResult<T = void> =
  | Workspace
  | (Record<string, unknown> & { workspace: Workspace; data?: T })

type ApplyOperation<OpResult extends OperationResult> = (
  node: Variant | Instance,
  workspace: Workspace,
  sourceResult?: OpResult,
) => OpResult

type Propagation = "none" | "downstream" | "bidirectional"

/** Applies an operation to a node and propagates it across instances per the propagation mode. */
export function propagateNodeOperation<OpResult extends OperationResult>({
  nodeId,
  propagation,
  apply,
  workspace,
}: {
  nodeId: VariantId | InstanceId
  propagation: Propagation
  apply: ApplyOperation<OpResult>
  workspace: Workspace
}): Workspace {
  const node = nodeRetrievalService.getNode(nodeId, workspace)

  switch (propagation) {
    case "none":
      return resolveWorkspace(apply(node, workspace))
    case "downstream":
      return applyDownstream(node, workspace, apply)
    case "bidirectional":
      return applyBidirectional(node, workspace, apply)
    default:
      throw new Error(`Invalid propagation: ${propagation}`)
  }
}

/**
 * Applies an operation to a child node and to the positionally matching child
 * inside every instance of the child's parent. Instance children are independent
 * clones that template from a shared catalog default rather than back-linking to
 * the source variant's child, so a child-rooted fan-out cannot reach them. This
 * roots the fan-out at the parent (mirroring insert) and resolves the matching
 * child by tree index in each parent instance.
 */
export function propagatePositionalChildOperation({
  childId,
  propagation,
  applyToChild,
  workspace,
}: {
  childId: VariantId | InstanceId
  propagation: Propagation
  applyToChild: (childId: EntryNodeId, workspace: Workspace) => Workspace
  workspace: Workspace
}): Workspace {
  const parent = findParentNode(childId, workspace)
  if (!parent) return applyToChild(childId, workspace)

  const index = getChildIndex(childId, workspace)

  return propagateNodeOperation({
    nodeId: parent.id as VariantId | InstanceId,
    propagation,
    apply: (parentNode, currentWorkspace) => {
      const board = getBoardByNodeId(currentWorkspace, parentNode.id)
      if (!board) return currentWorkspace
      const positionalChildId = getChildrenIds(board, parentNode.id)[index]
      if (!positionalChildId) return currentWorkspace
      return applyToChild(positionalChildId, currentWorkspace)
    },
    workspace,
  })
}

function applyDownstream<OpResult extends OperationResult>(
  node: Variant | Instance,
  workspace: Workspace,
  apply: ApplyOperation<OpResult>,
): Workspace {
  const result = apply(node, workspace)
  return propagateToInstances(node, resolveWorkspace(result), apply, result)
}

function applyBidirectional<OpResult extends OperationResult>(
  node: Variant | Instance,
  workspace: Workspace,
  apply: ApplyOperation<OpResult>,
): Workspace {
  const variant = typeCheckingService.isVariant(node)
    ? node
    : nodeRetrievalService.getVariant(
        instancePropagationVariantRootId(node),
        workspace,
      )

  const result = apply(variant, workspace)
  return propagateToInstances(variant, resolveWorkspace(result), apply, result)
}

function propagateToInstances<OpResult extends OperationResult>(
  node: Variant | Instance,
  workspace: Workspace,
  apply: ApplyOperation<OpResult>,
  sourceResult?: OpResult,
): Workspace {
  const instances = nodeRelationshipService.findInstances(node, workspace)
  let updatedWorkspace = workspace

  for (const instance of instances) {
    const result = apply(instance, updatedWorkspace, sourceResult)
    updatedWorkspace = propagateToInstances(
      instance,
      resolveWorkspace(result),
      apply,
      result,
    )
  }

  return updatedWorkspace
}

/** Extracts the workspace from an operation result, which may be a bare workspace or a wrapper. */
function resolveWorkspace(result: OperationResult): Workspace {
  return "workspace" in result ? result.workspace : result
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
