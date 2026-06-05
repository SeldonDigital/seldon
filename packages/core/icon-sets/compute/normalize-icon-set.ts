import type { IconId } from "../../icon-sets"
import type { IconSetPipelineInput, StockIconSet } from "../types/icon-set"

/**
 * Coerces icon set input into a clean schema. Drops empty icon ids and removes
 * duplicate icons while preserving order.
 */
export function normalizeIconSetInput(input: IconSetPipelineInput): StockIconSet {
  const seen = new Set<IconId>()
  const icons: IconId[] = []
  for (const icon of input.icons ?? []) {
    if (!icon || seen.has(icon)) continue
    seen.add(icon)
    icons.push(icon)
  }

  return {
    metadata: input.metadata,
    source: input.source,
    icons,
    defaultEnabledCategories: [...(input.defaultEnabledCategories ?? [])],
  }
}
