import { ExtractPayload, Workspace } from "../../../../index"
import { removeBoardByKey } from "./remove-board-by-key"

export function removeMedia(
  payload: ExtractPayload<"remove_media">,
  workspace: Workspace,
): Workspace {
  return removeBoardByKey(payload.catalogId, workspace)
}
