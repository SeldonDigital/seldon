import { ExtractPayload, Workspace } from "../../../../index"
import { removeBoardByKey } from "./remove-board-by-key"

export function removeComponent(
  payload: ExtractPayload<"remove_component">,
  workspace: Workspace,
): Workspace {
  return removeBoardByKey(payload.boardKey, workspace)
}
