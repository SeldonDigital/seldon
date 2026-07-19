import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

/**
 * AI-emittable action types whose reducers can legitimately drop a pre-existing
 * node id. Only `remove_instance` removes a node the model targets. Inserts and
 * duplicates only add ids, `move_instance` relocates the same id, and reorder,
 * `set_*`, and resource edits never drop one. So a node that disappears on a
 * turn without one of these is treated as corruption.
 */
const NODE_REMOVING_ACTION_TYPES = new Set<string>(["remove_instance"])

export type IntegrityResult = { ok: true } | { ok: false; reason: string }

/** Keys present in `before` but missing from `after`. */
function missingKeys(
  before: Record<string, unknown> | undefined,
  after: Record<string, unknown> | undefined,
): string[] {
  const next = after ?? {}
  return Object.keys(before ?? {}).filter((key) => !(key in next))
}

/**
 * Guards adopting the workspace the agent built. The turn already dry-ran every
 * action through the reducer, whose verification middleware throws on any
 * dangling or duplicate ref, so refs cannot break. This adds the one property
 * verification does not check: that the mutation only changed what its actions
 * changed. A removed board key, which no edit tool can produce, or a removed
 * node id with no `remove_instance` in the turn, signals a reducer bug and fails
 * the turn so the bad workspace never lands.
 */
export function checkTurnIntegrity(
  before: Workspace,
  after: Workspace,
  actions: WorkspaceAction[],
): IntegrityResult {
  const removedBoards = missingKeys(before.boards, after.boards)
  if (removedBoards.length > 0) {
    return {
      ok: false,
      reason: `board ${removedBoards.join(", ")} disappeared, which no edit can do`,
    }
  }

  const removedNodes = missingKeys(before.nodes, after.nodes)
  const hasRemoval = actions.some((action) =>
    NODE_REMOVING_ACTION_TYPES.has(action.type),
  )
  if (removedNodes.length > 0 && !hasRemoval) {
    return {
      ok: false,
      reason: `node ${removedNodes.join(", ")} disappeared without a remove action`,
    }
  }

  return { ok: true }
}
