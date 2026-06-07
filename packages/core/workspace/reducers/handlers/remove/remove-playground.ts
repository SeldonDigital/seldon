import { ExtractPayload, Workspace } from "../../../../index"
import { applyComponentKeyDeletion } from "./remove-component-catalog"

export function removePlayground(
  payload: ExtractPayload<"remove_playground">,
  workspace: Workspace,
): Workspace {
  return applyComponentKeyDeletion(payload.boardKey, workspace)
}
