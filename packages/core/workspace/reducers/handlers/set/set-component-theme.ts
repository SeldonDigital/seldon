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
 * Sets the default theme reference for a board when rules allow.
 */
export function setComponentTheme(
  payload: ExtractPayload<"set_component_theme">,
  workspace: Workspace,
): Workspace {
  if (rules.mutations.setTheme.board.allowed === false) {
    return workspace
  }

  return workspaceMutationService.setComponentTheme(
    payload.boardKey,
    payload.theme,
    workspace,
  )
}
