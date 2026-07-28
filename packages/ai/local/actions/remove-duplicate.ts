import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

import { commit } from "../commit"
import { resolveTargetWithHint } from "../resolvers/resolve-target-with-hint"
import {
  type FamilyOutcome,
  type TurnContext,
  recordStep,
} from "../turn-context"

/** Handles the `remove_instance` intent: target -> commit. */
export async function executeRemoveInstance(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const target = await resolveTargetWithHint(context)
  if (target.kind === "message") return { kind: "message", text: target.text }

  try {
    commit(context.state, {
      type: "remove_instance",
      payload: { instanceId: target.nodeId },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Removing was rejected: ${caught instanceof Error ? caught.message : "invalid action"}`,
    }
  }
  recordStep(context, "commit", true)
  return { kind: "applied", reply: `Removed ${target.nodeId}.` }
}

/**
 * Handles the `remove_component` intent: delete a whole component and its
 * board. The board key is the target node's catalog id, so this resolves the
 * node first, then removes the board that owns its component.
 */
export async function executeRemoveComponent(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const target = await resolveTargetWithHint(context)
  if (target.kind === "message") return { kind: "message", text: target.text }

  const catalogId = getNodeCatalogId(
    context.state.workspace.nodes[target.nodeId]!,
    context.state.workspace,
  )
  if (!catalogId || !context.state.workspace.boards[catalogId]) {
    return {
      kind: "message",
      text: `Couldn't find the component board for ${target.nodeId}. To delete just this element, ask to remove it instead.`,
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
      text: `Removing the component was rejected: ${caught instanceof Error ? caught.message : "invalid action"}`,
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: `Removed the ${catalogId} component and its board.`,
  }
}

/** Handles the `duplicate_node` intent: target -> commit. */
export async function executeDuplicate(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const target = await resolveTargetWithHint(context)
  if (target.kind === "message") return { kind: "message", text: target.text }

  try {
    commit(context.state, {
      type: "duplicate_node",
      payload: { nodeId: target.nodeId },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Duplicating was rejected: ${caught instanceof Error ? caught.message : "invalid action"}`,
    }
  }
  recordStep(context, "commit", true)
  return { kind: "applied", reply: `Duplicated ${target.nodeId}.` }
}
