import type { ExtractPayload, Workspace } from "../../../../index"
import {
  nodeRetrievalService,
  nodeTraversalService,
  nodeRelationshipService,
  nodeOperationsService,
  workspaceMutationService,
  workspaceThemeService,
  workspacePropagationService,
  typeCheckingService,
} from "../../../services"

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
