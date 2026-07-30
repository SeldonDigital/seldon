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
 * Thrown when an action validates but changes nothing. This is a failure to
 * accomplish the request, not a reducer rejection, so it carries its own type
 * and is recorded as ineffective rather than rejected. It THROWS rather than
 * returning, because a returned signal is one a caller can forget to read --
 * and a handler that misses it reports a change the workspace never got.
 */
export class IneffectiveActionError extends Error {
  constructor(readonly actionType: string) {
    super(
      "that didn't change anything -- it likely matched no node, or the value was already set",
    )
    this.name = "IneffectiveActionError"
  }
}

/**
 * The user-facing reason a commit failed, for either failure mode: the
 * reducer's own message on a rejection, or the ineffective explanation.
 * Handlers phrase the attempt ("Couldn't rename: ...") and this supplies
 * the why, so both modes read correctly from one call site each.
 */
export function commitFailureReason(caught: unknown): string {
  if (caught instanceof Error) return caught.message
  return "invalid action"
}

/**
 * Validates one proposed action against the turn's working copy and records it.
 * Runs the deterministic shape repair, then dry-runs the action through the
 * reducer. Both failure modes throw so a caller cannot proceed as if the edit
 * landed: a reducer rejection carries the reducer's exact reason, and an
 * action that validates but changes nothing throws
 * {@link IneffectiveActionError}. Both are captured on the turn state so the
 * transcript's outcome stays truthful.
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
    throw new IneffectiveActionError(rawAction.type)
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
