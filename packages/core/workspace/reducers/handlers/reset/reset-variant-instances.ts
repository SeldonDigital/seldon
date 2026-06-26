import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  nodeRetrievalService,
  typeCheckingService,
  workspaceMutationService,
} from "../../../services"

/**
 * Resets every direct instance of a user variant back to that variant. Each
 * instance whose template links straight to the variant is reset to source, so
 * its subtree clears overrides and repoints to the variant's matching children.
 * No-op for a default variant.
 */
export function resetVariantInstances(
  payload: ExtractPayload<"reset_variant_instances">,
  workspace: Workspace,
): Workspace {
  if (rules.mutations.reset.instance.allowed === false) {
    return workspace
  }

  const node = nodeRetrievalService.getNode(payload.variantRootId, workspace)
  if (!typeCheckingService.isUserVariant(node)) {
    return workspace
  }

  return workspaceMutationService.resetVariantInstances(
    payload.variantRootId,
    workspace,
  )
}
