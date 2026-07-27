import { workspaceMutationService } from "../../../services"

import type { ExtractPayload, Workspace } from "../../../../index"

export function resetNodeEditorData(
  payload: ExtractPayload<"reset_node_editor_data">,
  workspace: Workspace,
): Workspace {
  return workspaceMutationService.setNodeEditorData(payload.nodeId, undefined, workspace)
}
