import type { ActionRepair } from "../../repair/normalize-actions"
import type { RejectedActionResult } from "../../types"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

/**
 * Mutable state shared by a turn's tools. Seldon never lets this package write a
 * workspace, so tools do not touch real state: they advance a working copy
 * (`workspace`) to validate later actions against earlier ones, and accumulate
 * the accepted `actions` the editor applies through the reducer as one undo
 * step. `repairs`, `ineffective`, and `rejected` record per-action outcomes for
 * the debug log and transcript.
 *
 * `allowedNodeIds` and `allowedBoardKeys` are the Isolation closure, present
 * only when Isolation Mode is on. `commit` rejects an action whose anchor node
 * or board falls outside these sets and grows them as inserts mint new ids in
 * scope. Undefined means no isolation gate. The caller adopts the final working
 * copy directly, so the ids the turn minted stay stable.
 */
export interface PiTurnState {
  workspace: Workspace
  actions: WorkspaceAction[]
  repairs: ActionRepair[]
  ineffective: string[]
  rejected: RejectedActionResult[]
  allowedNodeIds?: Set<string>
  allowedBoardKeys?: Set<string>
}

/** Creates a fresh turn state seeded from the request workspace. */
export function createTurnState(workspace: Workspace): PiTurnState {
  return { workspace, actions: [], repairs: [], ineffective: [], rejected: [] }
}
