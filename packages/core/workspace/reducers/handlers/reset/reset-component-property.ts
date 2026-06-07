import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
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

/** Clears one `componentProperties` key on a board when board property edits are allowed. */
export function resetComponentProperty(
  payload: ExtractPayload<"reset_component_property">,
  workspace: Workspace,
): Workspace {
  if (!rules.mutations.setProperties.board.allowed) {
    return workspace
  }

  return workspaceMutationService.resetComponentProperty(
    payload.boardKey,
    {
      propertyKey: payload.propertyKey,
      subpropertyKey: payload.subpropertyKey,
    },
    workspace,
  )
}
