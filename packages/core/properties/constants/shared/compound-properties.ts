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

/**
 * Facet display order for each compound parent, used to sort sub-property rows
 * in property inspectors. `preset` stays first. Facets not listed keep their
 * existing relative order after the listed ones. The four border-side compounds
 * share the `border` facet set.
 */
export const COMPOUND_FACET_DISPLAY_ORDER: Record<string, readonly string[]> = {
  background: [
    "preset",
    "color",
    "blendMode",
    "image",
    "position",
    "size",
    "repeat",
    "filter",
    "brightness",
    "opacity",
  ],
  gradient: [
    "preset",
    "gradientType",
    "angle",
    "startColor",
    "startOpacity",
    "startBrightness",
    "startPosition",
    "endColor",
    "endOpacity",
    "endBrightness",
    "endPosition",
  ],
  shadow: [
    "preset",
    "offsetX",
    "offsetY",
    "blur",
    "spread",
    "color",
    "brightness",
    "opacity",
  ],
  border: [
    "preset",
    "style",
    "color",
    "width",
    "brightness",
    "opacity",
    "collapse",
  ],
  borderTop: [
    "preset",
    "style",
    "color",
    "width",
    "brightness",
    "opacity",
    "collapse",
  ],
  borderRight: [
    "preset",
    "style",
    "color",
    "width",
    "brightness",
    "opacity",
    "collapse",
  ],
  borderBottom: [
    "preset",
    "style",
    "color",
    "width",
    "brightness",
    "opacity",
    "collapse",
  ],
  borderLeft: [
    "preset",
    "style",
    "color",
    "width",
    "brightness",
    "opacity",
    "collapse",
  ],
  font: [
    "preset",
    "family",
    "style",
    "weight",
    "size",
    "lineHeight",
    "textCase",
    "letterSpacing",
  ],
  board: ["preset", "width", "height"],
}
