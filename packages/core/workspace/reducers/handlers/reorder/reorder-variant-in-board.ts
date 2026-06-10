import { rules } from "../../../../rules/config/rules.config"
import {
  nodeOperationsService,
  nodeRetrievalService,
  typeCheckingService,
  workspacePropagationService,
} from "../../../services"
import type { ExtractPayload, Workspace } from "../../../types"

/**
 * Reorders a variant root within its board's `variants` list. Gated by
 * `rules.mutations.reorder[entityType]`: user variants may move, the default
 * variant stays pinned because its rule denies reordering. The positional
 * invariant that index 0 holds the default variant is owned by
 * `validateReorderVariantInBoard` in the validation middleware.
 */
export function reorderVariantInBoard(
  payload: ExtractPayload<"reorder_variant_in_board">,
  workspace: Workspace,
): Workspace {
  const node = nodeRetrievalService.getNode(payload.variantRootId, workspace)
  if (!typeCheckingService.isVariant(node)) {
    return workspace
  }

  const entityType = typeCheckingService.getEntityType(node)
  const { allowed, propagation } = rules.mutations.reorder[entityType]
  if (!allowed) {
    return workspace
  }

  return workspacePropagationService.propagateNodeOperation({
    nodeId: payload.variantRootId,
    propagation,
    apply: (target, draft) =>
      nodeOperationsService.reorderVariantIndex(
        target,
        payload.newIndex,
        draft,
      ),
    workspace,
  })
}
