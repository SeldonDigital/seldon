import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  nodeRetrievalService,
  typeCheckingService,
  workspaceMutationService,
} from "../../../services"

/**
 * Rebuilds a single schema-backed user variant to its catalog schema variant
 * definition. Keeps the default variant tree as the fork base, so default
 * overrides still cascade into the variant. No-op for a default variant or a
 * user variant that has no matching schema variant.
 */
export function resetVariantToCatalog(
  payload: ExtractPayload<"reset_variant_to_catalog">,
  workspace: Workspace,
): Workspace {
  if (rules.mutations.reset.userVariant.allowed === false) {
    return workspace
  }

  const node = nodeRetrievalService.getNode(payload.variantRootId, workspace)
  if (!typeCheckingService.isUserVariant(node)) {
    return workspace
  }

  return workspaceMutationService.resetSchemaVariantToCatalog(
    payload.variantRootId,
    workspace,
  )
}
