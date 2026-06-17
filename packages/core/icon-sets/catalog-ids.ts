import { STOCK_ICON_SETS } from "./catalog"

/** Packaged icon set catalog ids. Use for icon set board `catalogId` validation. */
export const packagedIconSetCatalogIds: string[] = STOCK_ICON_SETS.map(
  (s) => s.metadata.id,
)
