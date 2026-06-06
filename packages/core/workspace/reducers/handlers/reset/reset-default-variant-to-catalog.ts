import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  nodeRetrievalService,
  typeCheckingService,
  workspaceMutationService,
} from "../../../services"

/**
 * Rebuilds a default variant’s composition tree to match its catalog schema
 * default. Restores removed children, drops added ones, fixes order, and resets
 * overrides, while preserving canonical child ids that schema variants and
 * instances reference.
 */
export function resetDefaultVariantToCatalog(
  payload: ExtractPayload<"reset_default_variant_to_catalog">,
  workspace: Workspace,
): Workspace {
  if (rules.mutations.setProperties.defaultVariant.allowed === false) {
    return workspace
  }

  const node = nodeRetrievalService.getNode(
    payload.defaultVariantRootId,
    workspace,
  )
  if (!typeCheckingService.isDefaultVariant(node)) {
    return workspace
  }

  return workspaceMutationService.resetDefaultVariantToCatalog(
    payload.defaultVariantRootId,
    workspace,
  )
}
