import type { Workspace } from "../model/workspace"
import { workspaceReducer } from "./reducer"
import type { WorkspaceAction } from "./types"

/**
 * Folds a list of {@link WorkspaceAction} through {@link workspaceReducer}.
 * Prefer this over ad-hoc `reduce` when you want a single import site.
 */
export function applyActions(
  workspace: Workspace,
  actions: ReadonlyArray<WorkspaceAction>,
): Workspace {
  return actions.reduce((w, action) => workspaceReducer(w, action), workspace)
}
