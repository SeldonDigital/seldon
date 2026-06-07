import { packagedFontCollectionCatalogIds } from "../../../font-collections/catalog-ids"
import { packagedIconSetCatalogIds } from "../../../icon-sets/catalog-ids"
import { packagedThemeCatalogIds } from "../../../themes"

/**
 * Packaged theme catalog ids from `core/themes`. Use for theme board `catalogId` validation.
 */
export const THEME_BOARD_CATALOG_IDS: ReadonlySet<string> = new Set<string>(
  packagedThemeCatalogIds,
)

/**
 * Packaged font collection catalog ids from `core/font-collections`. Use for font collection
 * board `catalogId` validation.
 */
export const FONT_COLLECTION_BOARD_CATALOG_IDS: ReadonlySet<string> =
  new Set<string>(packagedFontCollectionCatalogIds)

/**
 * Packaged icon set catalog ids from `core/icon-sets`. Use for icon set board
 * `catalogId` validation.
 */
export const ICON_SET_BOARD_CATALOG_IDS: ReadonlySet<string> =
  new Set<string>(packagedIconSetCatalogIds)

/**
 * Allowlist of media board catalog ids for `catalogId` validation. `core/media/` has no
 * `catalog-ids.ts` registry, so these ids are listed inline.
 */
export const MEDIA_BOARD_CATALOG_IDS: ReadonlySet<string> = new Set<string>([
  "seldonMedia",
  "adobeStockMedia",
])
