import type { Workspace } from "../../model/workspace"
import type { WorkspaceAction } from "../../reducers/types"

export type Action = WorkspaceAction

export type Middleware<T extends Action = Action> = (
  next: (workspace: Workspace, action: T) => Workspace,
) => (workspace: Workspace, action: T) => Workspace
