import { normalizeFontCollectionInput } from "../compute/normalize-font-collection"
import type {
  ComputedFontCollection,
  FontCollectionPipelineInput,
} from "../types/font-collection"

/**
 * Materializes a `StockFontCollection` schema (or recomputes a computed collection) into a
 * complete collection. Sets `id` from `metadata.id`.
 */
export function computeFontCollection(
  collection: FontCollectionPipelineInput,
): ComputedFontCollection {
  const normalized = normalizeFontCollectionInput(collection)
  return {
    ...normalized,
    id: normalized.metadata.id,
  }
}
