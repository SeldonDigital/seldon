import { rules } from "../../../../rules/config/rules.config"
import {
  debugGroup,
  debugGroupEnd,
  debugLog,
} from "../../../../utils/debug-logger"
import {
  nodeRetrievalService,
  nodeOperationsService,
  workspacePropagationService,
  typeCheckingService,
} from "../../../services"
import { ExtractPayload, Workspace } from "../../../types"

export function removeVariant(
  payload: ExtractPayload<"remove_variant">,
  workspace: Workspace,
): Workspace {
  const node = nodeRetrievalService.getNode(payload.variantRootId, workspace)
  const entityType = typeCheckingService.getEntityType(node)
  const isVariant = typeCheckingService.isVariant(node)
  const isDefaultVariant = typeCheckingService.isDefaultVariant(node)

  debugGroup("Workspace", "removeVariant", "Removing variant")
  debugLog("Workspace", "removeVariant", "Variant details", {
    variantRootId: payload.variantRootId,
    entityType,
    isVariant,
    isDefaultVariant,
  })

  if (!isVariant) {
    debugLog("Workspace", "removeVariant", "Removal not allowed for non-variant")
    debugGroupEnd(
      "Workspace",
      "removeVariant",
      "Removal not allowed for non-variant",
    )
    return workspace
  }

  // The default variant is denied by `delete.defaultVariant.allowed === false`,
  // so the rule gate below is the single owner of that policy.
  const { allowed, propagation } = rules.mutations.delete[entityType]
  if (!allowed) {
    debugLog("Workspace", "removeVariant", "Removal not allowed for variant")
    debugGroupEnd(
      "Workspace",
      "removeVariant",
      "Removal not allowed for variant",
    )
    return workspace
  }

  const result = workspacePropagationService.propagateNodeOperation({
    nodeId: payload.variantRootId,
    propagation,
    apply: (node, workspace) => {
      // Downstream propagation visits linked instances, never variants, so the
      // variant check keeps `deleteVariant` from running on a propagated node.
      if (!typeCheckingService.isVariant(node)) return workspace
      return nodeOperationsService.deleteVariant(node.id, workspace)
    },
    workspace,
  })

  debugLog("Workspace", "removeVariant", "Variant removal complete")
  debugGroupEnd("Workspace", "removeVariant", "Variant removal complete")
  return result
}
