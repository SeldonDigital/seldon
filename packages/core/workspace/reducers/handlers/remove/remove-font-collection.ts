import { ExtractPayload, Workspace } from "../../../../index"
import { applyComponentKeyDeletion } from "./remove-component-catalog"

export function removeFontCollection(
  payload: ExtractPayload<"remove_font_collection">,
  workspace: Workspace,
): Workspace {
  return applyComponentKeyDeletion(payload.catalogId, workspace)
}
