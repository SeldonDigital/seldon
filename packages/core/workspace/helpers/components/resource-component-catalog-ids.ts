import { packagedFontCollectionCatalogIds } from "../../../font-collections/catalog-ids"
import { STOCK_THEMES } from "../../../themes"
import type { StockTheme } from "../../../themes/types"

/**
 * Packaged stock theme template ids from `STOCK_THEMES` metadata. Use for theme board `catalogId` validation.
 */
export const THEME_COMPONENT_CATALOG_IDS: ReadonlySet<string> = new Set(
  STOCK_THEMES.map((theme) => theme.metadata.id),
)

/**
 * Resolves a theme board `catalogId` to the matching packaged stock theme row, or null.
 */
export function resolvePackagedThemeByCatalogId(
  catalogId: string,
): StockTheme | null {
  return STOCK_THEMES.find((theme) => theme.metadata.id === catalogId) ?? null
}

/**
 * Packaged font collection catalog ids from `core/font-collections`. Use for font collection
 * board `catalogId` validation.
 */
export const FONT_COLLECTION_COMPONENT_CATALOG_IDS: ReadonlySet<string> =
  new Set<string>(packagedFontCollectionCatalogIds)

/**
 * Stub allowlist until `core/icon-sets/` exposes a generated catalog id registry.
 *
 * // import { packagedIconSetCatalogIds } from "../../../icon-sets/catalog-ids"
 * // export const ICON_SET_COMPONENT_CATALOG_IDS = new Set<string>(packagedIconSetCatalogIds)
 */
export const ICON_SET_COMPONENT_CATALOG_IDS: ReadonlySet<string> = new Set<string>([
  "seldonIcons",
  "googleMaterial",
  "ibmCarbon",
])

/**
 * Stub allowlist until `core/media/` exposes a generated catalog id registry.
 *
 * // import { packagedMediaCatalogIds } from "../../../media/catalog-ids"
 * // export const MEDIA_COMPONENT_CATALOG_IDS = new Set<string>(packagedMediaCatalogIds)
 */
export const MEDIA_COMPONENT_CATALOG_IDS: ReadonlySet<string> = new Set<string>([
  "seldonMedia",
  "adobeStockMedia",
])
