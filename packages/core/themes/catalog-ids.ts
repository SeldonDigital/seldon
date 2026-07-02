import { STOCK_THEMES } from "./catalog"

/** Packaged theme template ids. Use for theme board `catalogId` validation. */
export const packagedThemeCatalogIds: string[] = STOCK_THEMES.map(
  (theme) => theme.metadata.id,
)
