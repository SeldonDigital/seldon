import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

import { commit, commitFailureReason } from "../commit"
import { resolveTargetWithHint } from "../resolvers/resolve-target-with-hint"
import {
  type FamilyOutcome,
  type TurnContext,
  forwardClarification,
  isClarification,
  recordStep,
  refuseSetTarget,
} from "../turn-context"

/** Handles the `remove_instance` intent: target -> commit. */
export async function executeRemoveInstance(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const resolvedTarget = await resolveTargetWithHint(context)
  if (isClarification(resolvedTarget))
    return forwardClarification(resolvedTarget)
  if (resolvedTarget.kind === "resolved-many")
    return refuseSetTarget("act on", resolvedTarget.nodeIds.length)

  try {
    commit(context.state, {
      type: "remove_instance",
      payload: { instanceId: resolvedTarget.nodeId },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't remove: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })
  return { kind: "applied", reply: `Removed ${resolvedTarget.nodeId}.` }
}

/**
 * Handles the `remove_component` intent: delete a whole component and its
 * board. The board key is the target node's catalog id, so this resolves the
 * node first, then removes the board that owns its component.
 */
export async function executeRemoveComponent(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const resolvedTarget = await resolveTargetWithHint(context)
  if (isClarification(resolvedTarget))
    return forwardClarification(resolvedTarget)
  if (resolvedTarget.kind === "resolved-many")
    return refuseSetTarget("act on", resolvedTarget.nodeIds.length)

  const catalogId = getNodeCatalogId(
    context.state.workspace.nodes[resolvedTarget.nodeId]!,
    context.state.workspace,
  )
  if (!catalogId || !context.state.workspace.boards[catalogId]) {
    return {
      kind: "message",
      text: `Couldn't find the component board for ${resolvedTarget.nodeId}. To delete just this element, ask to remove it instead.`,
    }
  }

  try {
    commit(context.state, {
      type: "remove_board",
      payload: { boardKey: catalogId },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't remove the component: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })
  return {
    kind: "applied",
    reply: `Removed the ${catalogId} component and its board.`,
  }
}

/** Handles the `duplicate_node` intent: target -> commit. */
export async function executeDuplicate(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const resolvedTarget = await resolveTargetWithHint(context)
  if (isClarification(resolvedTarget))
    return forwardClarification(resolvedTarget)
  if (resolvedTarget.kind === "resolved-many")
    return refuseSetTarget("act on", resolvedTarget.nodeIds.length)

  try {
    commit(context.state, {
      type: "duplicate_node",
      payload: { nodeId: resolvedTarget.nodeId },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't duplicate: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })
  return { kind: "applied", reply: `Duplicated ${resolvedTarget.nodeId}.` }
}
