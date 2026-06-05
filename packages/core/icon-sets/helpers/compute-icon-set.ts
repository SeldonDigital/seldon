import { normalizeIconSetInput } from "../compute/normalize-icon-set"
import type { ComputedIconSet, IconSetPipelineInput } from "../types/icon-set"

/**
 * Materializes a `StockIconSet` schema (or recomputes a computed set) into a
 * complete icon set. Sets `id` from `metadata.id`.
 */
export function computeIconSet(set: IconSetPipelineInput): ComputedIconSet {
  const normalized = normalizeIconSetInput(set)
  return {
    ...normalized,
    id: normalized.metadata.id,
  }
}
