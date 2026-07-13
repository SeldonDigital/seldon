import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

import type { ActionRepair } from "../../repair/normalize-actions"

/**
 * Mutable state shared by a turn's tools. Seldon never lets this package write a
 * workspace, so tools do not touch real state: they advance a working copy to
 * validate later actions against earlier ones, and accumulate the actions the
 * editor will apply through the reducer as one undo step.
 */
export interface PiTurnState {
  /** Working copy advanced by each accepted action, seeded from the request workspace. */
  workspace: Workspace
  /** Actions accepted this turn, in call order, returned to the caller. */
  actions: WorkspaceAction[]
  /** Deterministic shape fixes applied before validation, for the debug log. */
  repairs: ActionRepair[]
}

/** Creates a fresh turn state seeded from the request workspace. */
export function createTurnState(workspace: Workspace): PiTurnState {
  return { workspace, actions: [], repairs: [] }
}
