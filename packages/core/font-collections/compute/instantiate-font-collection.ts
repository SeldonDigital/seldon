import merge from "lodash/merge"
import { computeFontCollection } from "../helpers/compute-font-collection"
import type {
  ComputedFontCollection,
  StockFontCollection,
} from "../types/font-collection"
import type { FontCollectionTemplateId } from "../types/font-collection-id"

/** Packaged collection schemas keyed by catalog id (pass `STOCK_FONT_COLLECTIONS_BY_ID`). */
export type PresetFontCollectionsById = Record<
  FontCollectionTemplateId,
  StockFontCollection
>

/**
 * Instantiates a computed collection from a packaged schema and optional family overrides.
 * Merges with `lodash/merge`, then runs `computeFontCollection`.
 */
export function instantiateFontCollection(
  templateId: FontCollectionTemplateId,
  overrides: Record<string, unknown> | undefined,
  presetsById: PresetFontCollectionsById,
): ComputedFontCollection {
  const base = presetsById[templateId]
  if (!base) {
    throw new Error(`Unknown font collection template: ${templateId}`)
  }
  if (!overrides || Object.keys(overrides).length === 0) {
    return computeFontCollection(base)
  }
  const merged = merge({}, base, overrides) as StockFontCollection
  return computeFontCollection(merged)
}
