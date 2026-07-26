import type { RejectedActionResult } from "@seldon/ai"
import type {
  BoardKey,
  Workspace,
  WorkspaceAction,
} from "@seldon/core/workspace/types"

export type RejectedAction = RejectedActionResult

export interface ApplyReport {
  workspace: Workspace
  applied: string[]
  ineffective: string[]
  rejected: RejectedAction[]
  /** Actions that produced a real change, kept for the console change summary. */
  appliedActions: WorkspaceAction[]
}

/** Finds the board map key for the currently active board, if any. */
export function findActiveBoardKey(
  workspace: Workspace,
  activeBoard: Workspace["boards"][BoardKey] | null,
): BoardKey | undefined {
  if (!activeBoard) return undefined
  return Object.keys(workspace.boards).find(
    (key) => workspace.boards[key] === activeBoard,
  )
}

/**
 * Assembles the turn report from the workspace the agent already built. The
 * turn dry-ran every action through the reducer against its working copy, so
 * the caller adopts that workspace directly with one `set_workspace` dispatch
 * instead of re-applying the actions. Re-applying would re-mint the random ids
 * of nodes created mid-turn and silently drop any follow-on edit that targeted
 * them. `ineffective` and `rejected` come from the turn, so the transcript
 * outcome stays truthful.
 */
export function buildTurnReport(
  workspace: Workspace,
  actions: WorkspaceAction[],
  ineffective: string[],
  rejected: RejectedAction[],
): ApplyReport {
  return {
    workspace,
    applied: actions.map((action) => action.type),
    ineffective,
    rejected,
    appliedActions: actions,
  }
}
