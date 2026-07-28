import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

import { normalizeActions } from "../repair/normalize-actions"
import type { TurnState } from "./turn-state"

/** True when applying an action left the working copy effectively unchanged. */
function isUnchanged(before: unknown, after: unknown): boolean {
  if (before === after) return true
  return JSON.stringify(before) === JSON.stringify(after)
}

/**
 * Validates one proposed action against the turn's working copy and records it.
 * Runs the deterministic shape repair, then dry-runs the action through the
 * reducer. A reducer rejection is recorded and rethrown so the caller can
 * surface the exact reason (e.g. as a resolver's disambiguation message). A
 * validated action that changes nothing is reported without recording it, so
 * the caller can retarget instead of applying a no-op. Both are also captured
 * on the turn state so the transcript's outcome stays truthful.
 */
export function commit(state: TurnState, rawAction: WorkspaceAction): string {
  const { actions: normalized, repairs } = normalizeActions([rawAction])
  let next
  try {
    next = applyActions(state.workspace, normalized)
  } catch (caught) {
    state.rejected.push({
      type: rawAction.type,
      reason: caught instanceof Error ? caught.message : "invalid action",
    })
    throw caught
  }
  if (isUnchanged(state.workspace, next)) {
    state.ineffective.push(rawAction.type)
    return `Action "${rawAction.type}" validated but changed nothing. It likely matched no node or set a value already in place. Check the target id and try a different edit.`
  }
  // Record ids this action minted, so a later step can resolve "the new X"
  // deterministically. Same cheap key diff withCreatedIdentity reports from.
  const before = state.workspace.nodes ?? {}
  for (const id of Object.keys(next.nodes ?? {})) {
    if (!(id in before)) state.createdIds.add(id)
  }
  state.workspace = next
  state.actions.push(...normalized)
  state.repairs.push(...repairs)
  return `Applied ${rawAction.type}.`
}
