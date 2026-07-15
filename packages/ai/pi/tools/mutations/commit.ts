import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

import { normalizeActions } from "../../../repair/normalize-actions"
import type { PiTurnState } from "../turn-state"

/** Wraps a plain string in the tool result shape Pi expects. */
export function textResult(text: string) {
  return { content: [{ type: "text" as const, text }], details: {} }
}

/** True when applying an action left the working copy effectively unchanged. */
function isUnchanged(before: unknown, after: unknown): boolean {
  if (before === after) return true
  return JSON.stringify(before) === JSON.stringify(after)
}

/**
 * Validates one proposed action against the turn's working copy and records it.
 * Runs the deterministic shape repair, then dry-runs the action through the
 * reducer. A reducer rejection is recorded and rethrown so Pi feeds the exact
 * reason back to the model as a tool error, which is how the model self-corrects.
 * A validated action that changes nothing is reported without recording it, so
 * the model can retarget instead of the caller applying a no-op. Both are also
 * captured on the turn state so the transcript's outcome stays truthful.
 */
export function commit(state: PiTurnState, rawAction: WorkspaceAction): string {
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
  state.workspace = next
  state.actions.push(...normalized)
  state.repairs.push(...repairs)
  return `Applied ${rawAction.type}.`
}
