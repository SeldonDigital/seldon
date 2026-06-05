import { packagedFontCollectionCatalogIds } from "../../../font-collections/catalog-ids"
import { packagedThemeCatalogIds } from "../../../themes"

/**
 * Packaged theme catalog ids from `core/themes`. Use for theme board `catalogId` validation.
 */
export const THEME_COMPONENT_CATALOG_IDS: ReadonlySet<string> = new Set<string>(
  packagedThemeCatalogIds,
)

/**
 * Packaged font collection catalog ids from `core/font-collections`. Use for font collection
 * board `catalogId` validation.
 */
export const FONT_COLLECTION_COMPONENT_CATALOG_IDS: ReadonlySet<string> =
  new Set<string>(packagedFontCollectionCatalogIds)

/**
 * Stub allowlist until `core/icon-sets/` exposes a `catalog-ids.ts` registry. Replace with
 * `new Set<string>(packagedIconSetCatalogIds)` once that module lands, matching themes and
 * font-collections.
 */
export const ICON_SET_COMPONENT_CATALOG_IDS: ReadonlySet<string> = new Set<string>([
  "seldonIcons",
  "googleMaterial",
  "ibmCarbon",
])

/**
 * Stub allowlist until `core/media/` exposes a `catalog-ids.ts` registry. Replace with
 * `new Set<string>(packagedMediaCatalogIds)` once that module lands, matching themes and
 * font-collections.
 */
export const MEDIA_COMPONENT_CATALOG_IDS: ReadonlySet<string> = new Set<string>([
  "seldonMedia",
  "adobeStockMedia",
])
