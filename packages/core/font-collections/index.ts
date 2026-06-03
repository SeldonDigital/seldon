/**
 * Font families packaged as collections, plus the materialization helpers.
 *
 * A collection lists font families. The `System` collection renders local fonts with no
 * network request. The `Google Fonts` collection lists remote families. Prefer
 * `@seldon/core/font-collections/helpers` for `computeFontCollection` or
 * `font-collections/compute` for `instantiateFontCollection`.
 */
export * from "./constants"
export {
  computeFontCollection,
  normalizeFontCollection,
  getRemoteFontUrl,
  isRemoteFontFamily,
  getFamilyNameByValue,
} from "./helpers"
export {
  STOCK_FONT_COLLECTIONS,
  STOCK_FONT_COLLECTIONS_BY_ID,
  FONT_COLLECTIONS,
  FONT_COLLECTIONS_BY_ID,
  defaultFontCollection,
} from "./collections"
export {
  instantiateFontCollection,
  type PresetFontCollectionsById,
} from "./compute"
export { packagedFontCollectionCatalogIds } from "./catalog-ids"
export * from "./types"
