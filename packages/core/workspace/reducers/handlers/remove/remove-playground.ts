import { ExtractPayload, Workspace } from "../../../../index"
import { removeBoardByKey } from "./remove-board-by-key"

export function removePlayground(
  payload: ExtractPayload<"remove_playground">,
  workspace: Workspace,
): Workspace {
  return removeBoardByKey(payload.boardKey, workspace)
}
