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

/**
 * Sets or clears `workspace.nodes[nodeId].__editor`.
 */
export function setNodeEditorData(
  payload: ExtractPayload<"set_node_editor_data">,
  workspace: Workspace,
): Workspace {
  return workspaceMutationService.setNodeEditorData(
    payload.nodeId,
    payload.editorData,
    workspace,
  )
}
