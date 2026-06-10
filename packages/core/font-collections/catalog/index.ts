import { computeFontCollection } from "../helpers/compute-font-collection"
import type {
  ComputedFontCollection,
  StockFontCollection,
} from "../types/font-collection"
import type { FontCollectionTemplateId } from "../types/font-collection-id"
import googleStock from "./google"
import systemStock, { defaultFontCollection } from "./system"

/** Packaged font collection definitions (`catalog/*.ts`), display order. */
export const STOCK_FONT_COLLECTIONS: StockFontCollection[] = [
  systemStock,
  googleStock,
]

export const STOCK_FONT_COLLECTIONS_BY_ID = Object.fromEntries(
  STOCK_FONT_COLLECTIONS.map((c) => [c.metadata.id, c]),
) as Record<FontCollectionTemplateId, StockFontCollection>

/** Computed packaged collections, same order as `STOCK_FONT_COLLECTIONS`. */
export const FONT_COLLECTIONS: ComputedFontCollection[] =
  STOCK_FONT_COLLECTIONS.map(computeFontCollection)

export const FONT_COLLECTIONS_BY_ID = Object.fromEntries(
  FONT_COLLECTIONS.map((c) => [c.id, c]),
) as Record<FontCollectionTemplateId, ComputedFontCollection>

export { computeFontCollection }
export { defaultFontCollection }
