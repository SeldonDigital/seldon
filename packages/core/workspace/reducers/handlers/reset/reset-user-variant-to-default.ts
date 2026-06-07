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
 * Copies the default variant’s composition tree onto a user variant root and clears that root’s overrides.
 */
export function resetUserVariantToDefault(
  payload: ExtractPayload<"reset_user_variant_to_default">,
  workspace: Workspace,
): Workspace {
  if (rules.mutations.reset.userVariant.allowed === false) {
    return workspace
  }

  const node = nodeRetrievalService.getNode(payload.variantRootId, workspace)
  if (!typeCheckingService.isUserVariant(node)) {
    return workspace
  }

  return workspaceMutationService.resetUserVariantToDefaultVariant(
    payload.variantRootId,
    workspace,
  )
}
