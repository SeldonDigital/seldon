/**
 * Top-level keys grouped as shorthands in the catalog. Each stores a single facet object on the node.
 */
export const PROPERTY_SHORTHAND_KEYS = [
  "margin",
  "padding",
  "corners",
  "position",
] as const

export type PropertyShorthandCatalogKey =
  (typeof PROPERTY_SHORTHAND_KEYS)[number]

const SHORTHAND_CATALOG_KEY_SET = new Set<string>(PROPERTY_SHORTHAND_KEYS)

/** True when the name is a shorthand catalog parent. */
export function isShorthandCatalogProperty(
  propertyName: string,
): propertyName is PropertyShorthandCatalogKey {
  return SHORTHAND_CATALOG_KEY_SET.has(propertyName)
}
