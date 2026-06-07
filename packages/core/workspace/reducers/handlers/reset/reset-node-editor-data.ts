import type { ExtractPayload, Workspace } from "../../../../index"
import { workspaceMutationService } from "../../../services"

export function resetNodeEditorData(
  payload: ExtractPayload<"reset_node_editor_data">,
  workspace: Workspace,
): Workspace {
  return workspaceMutationService.setNodeEditorData(
    payload.nodeId,
    undefined,
    workspace,
  )
}
