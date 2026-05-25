import { rules } from "../../../../rules/config/rules.config"
import type { ComponentKey, Workspace } from "../../../types"
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
 * Shared board deletion: rules gate then {@link nodeOperationsService.deleteComponentByKey}.
 */
export function applyComponentKeyDeletion(
  componentKey: ComponentKey,
  workspace: Workspace,
): Workspace {
  if (rules.mutations.delete.board.allowed === false) {
    return workspace
  }

  return nodeOperationsService.deleteComponentByKey(componentKey, workspace)
}
