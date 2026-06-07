import { ExtractPayload, Workspace } from "../../../../index"
import { removeBoardByKey } from "./remove-board-by-key"

export function removeFontCollection(
  payload: ExtractPayload<"remove_font_collection">,
  workspace: Workspace,
): Workspace {
  return removeBoardByKey(payload.catalogId, workspace)
}
