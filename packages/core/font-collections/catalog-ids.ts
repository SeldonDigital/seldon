import { STOCK_FONT_COLLECTIONS } from "./collections"

/** Packaged collection catalog ids. Use for font collection board `catalogId` validation. */
export const packagedFontCollectionCatalogIds: string[] =
  STOCK_FONT_COLLECTIONS.map((c) => c.metadata.id)
