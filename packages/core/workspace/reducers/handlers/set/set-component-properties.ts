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

/**
 * Merges editor layout properties onto a board when rules allow.
 */
export function setComponentProperties(
  payload: ExtractPayload<"set_component_properties">,
  workspace: Workspace,
): Workspace {
  if (rules.mutations.setProperties.board.allowed === false) {
    return workspace
  }

  return workspaceMutationService.setComponentProperties(
    payload.componentKey,
    payload.properties,
    workspace,
  )
}
