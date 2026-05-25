/**
 * Top-level keys grouped as compounds in the catalog.
 * `nodeStorage` is how merge and compute walk the node for each key.
 */
export const PROPERTY_COMPOUND_CATALOG = [
  { key: "background", nodeStorage: "layered" },
  { key: "gradient", nodeStorage: "layered" },
  { key: "shadow", nodeStorage: "layered" },
  { key: "border", nodeStorage: "facets" },
  { key: "borderTop", nodeStorage: "facets" },
  { key: "borderRight", nodeStorage: "facets" },
  { key: "borderBottom", nodeStorage: "facets" },
  { key: "borderLeft", nodeStorage: "facets" },
  { key: "font", nodeStorage: "facets" },
  { key: "board", nodeStorage: "facets" },
] as const

export type PropertyCompoundCatalogEntry =
  (typeof PROPERTY_COMPOUND_CATALOG)[number]

export type PropertyCompoundCatalogKey = PropertyCompoundCatalogEntry["key"]

const COMPOUND_CATALOG_KEY_SET = new Set<string>(
  PROPERTY_COMPOUND_CATALOG.map((entry) => entry.key),
)

/** True when the name is a compound catalog parent. */
export function isCompoundCatalogProperty(
  propertyName: string,
): propertyName is PropertyCompoundCatalogKey {
  return COMPOUND_CATALOG_KEY_SET.has(propertyName)
}
