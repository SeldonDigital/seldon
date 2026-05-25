import type { WorkspaceAction } from "../../reducers/types"
import type { Workspace } from "../../model/workspace"

export type Action = WorkspaceAction

export type Middleware<T extends Action = Action> = (
  next: (workspace: Workspace, action: T) => Workspace,
) => (workspace: Workspace, action: T) => Workspace
