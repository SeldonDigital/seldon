import type { ComponentId } from "@seldon/core/components/constants"
import type { InstanceId, VariantId, Workspace } from "@seldon/core/index"

/**
 * AI suggest is not available in the local editor. Always returns null so canvas
 * and tracking use standard insert / component flows instead of the suggest dialog.
 */
export function getSuggestTaskForObject(
  _objectId: ComponentId | VariantId | InstanceId,
  _workspace: Workspace,
): null {
  return null
}
