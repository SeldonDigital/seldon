import { ComponentId } from "@seldon/core/components/constants"
import {
  collectMissingSchemaVariants,
  getMissingSchemaVariantMessage,
} from "@seldon/core/workspace/helpers/nodes/collect-missing-schema-variants"

/**
 * Prompts for each missing catalog variant referenced in a component composition.
 * Returns variant fallback slot keys when the user accepts defaults, or null when
 * the user declines and the add should be aborted.
 */
export async function confirmMissingSchemaVariants(
  componentId: ComponentId,
): Promise<string[] | null> {
  const issues = collectMissingSchemaVariants(componentId)
  if (!issues.length) {
    return []
  }

  const variantFallbacks: string[] = []

  for (const issue of issues) {
    const accepted = window.confirm(getMissingSchemaVariantMessage(issue))
    if (!accepted) {
      return null
    }
    variantFallbacks.push(issue.slotKey)
  }

  return variantFallbacks
}
