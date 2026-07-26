import { packagedFontCollectionCatalogIds } from "../../../font-collections/catalog-ids"
import { packagedIconSetCatalogIds } from "../../../icon-sets/catalog-ids"
import { packagedThemeCatalogIds } from "../../../themes"
import type { Board, ThemeBoard } from "../../model/components"
import { isThemeBoard } from "../../model/components"

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
export const ICON_SET_BOARD_CATALOG_IDS: ReadonlySet<string> = new Set<string>(
  packagedIconSetCatalogIds,
)

/**
 * Allowlist of media board catalog ids for `catalogId` validation. `core/media/` has no
 * `catalog-ids.ts` registry, so these ids are listed inline.
 */
export const MEDIA_BOARD_CATALOG_IDS: ReadonlySet<string> = new Set<string>([
  "seldonMedia",
  "adobeStockMedia",
])

/**
 * A workspace-authored theme board. It is a theme board whose `catalogId` is not
 * a packaged stock theme, so it owns its name and tokens and is renamable, unlike
 * stock theme boards that mirror the catalog.
 */
export function isAuthoredThemeBoard(entry: Board): entry is ThemeBoard {
  return isThemeBoard(entry) && !THEME_BOARD_CATALOG_IDS.has(entry.catalogId)
}
