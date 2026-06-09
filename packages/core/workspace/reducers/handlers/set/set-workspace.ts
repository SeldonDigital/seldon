import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { ErrorMessages } from "../../../constants"
import { findBoardTreeCycleId } from "../../../helpers/components/find-tree-cycle"
import { ensureWorkspaceEditableThemeEntry } from "../../../helpers/themes/workspace-editable-theme"
import { WorkspaceValidationError } from "../../../middleware/validation/workspace-validation-error"

/**
 * Replaces the workspace with `payload.workspace` and ensures the editable theme row exists.
 */
export function setWorkspace(
  payload: ExtractPayload<"set_workspace">,
): Workspace {
  const workspace = payload.workspace as Workspace

  // Reject a cyclic board tree before `produce` freezes it. Immer freezes by
  // recursing through the nested tree, so a cycle here would overflow the call
  // stack instead of surfacing a usable error.
  const cycleId = findBoardTreeCycleId(workspace)
  if (cycleId) {
    throw new WorkspaceValidationError(
      ErrorMessages.cyclicComponentTree(cycleId),
      { type: "set_workspace", payload },
    )
  }

  return produce(workspace, (draft) => {
    ensureWorkspaceEditableThemeEntry(draft)
  })
}
