import { ExtractPayload, Workspace } from "../../../../index"
import { applyComponentKeyDeletion } from "./remove-component-catalog"

export function removeMedia(
  payload: ExtractPayload<"remove_media">,
  workspace: Workspace,
): Workspace {
  return applyComponentKeyDeletion(payload.catalogId, workspace)
}
