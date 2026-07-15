import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

import type { ActionRepair } from "../../repair/normalize-actions"
import type { RejectedActionResult } from "../../types"

/**
 * Mutable state shared by a turn's tools. Seldon never lets this package write a
 * workspace, so tools do not touch real state: they advance a working copy to
 * validate later actions against earlier ones, and accumulate the actions the
 * editor will apply through the reducer as one undo step. The caller adopts the
 * final working copy directly, so the ids the turn minted stay stable.
 */
export interface PiTurnState {
  /** Working copy advanced by each accepted action, seeded from the request workspace. */
  workspace: Workspace
  /** Actions accepted this turn, in call order, returned to the caller. */
  actions: WorkspaceAction[]
  /** Deterministic shape fixes applied before validation, for the debug log. */
  repairs: ActionRepair[]
  /** Action types that validated but changed nothing, for the transcript outcome. */
  ineffective: string[]
  /** Actions the reducer rejected this turn, with the reducer's reason. */
  rejected: RejectedActionResult[]
}

/** Creates a fresh turn state seeded from the request workspace. */
export function createTurnState(workspace: Workspace): PiTurnState {
  return { workspace, actions: [], repairs: [], ineffective: [], rejected: [] }
}
