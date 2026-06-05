import { STOCK_THEMES } from "./catalog"
import type { StockTheme } from "./types/theme"

/** Packaged theme template ids. Use for theme board `catalogId` validation. */
export const packagedThemeCatalogIds: string[] = STOCK_THEMES.map(
  (theme) => theme.metadata.id,
)

/** Resolves a theme board `catalogId` to the matching packaged stock theme, or null. */
export function resolvePackagedThemeByCatalogId(
  catalogId: string,
): StockTheme | null {
  return STOCK_THEMES.find((theme) => theme.metadata.id === catalogId) ?? null
}
