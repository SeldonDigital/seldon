import { ExtractPayload, Workspace } from "../../../../index"
import { applyComponentKeyDeletion } from "./remove-component-catalog"

export function removeComponent(
  payload: ExtractPayload<"remove_component">,
  workspace: Workspace,
): Workspace {
  return applyComponentKeyDeletion(payload.componentId, workspace)
}
