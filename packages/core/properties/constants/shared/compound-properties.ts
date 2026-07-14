/**
 * Top-level keys grouped as compounds in the catalog.
 * `nodeStorage` is how merge and compute walk the node for each key.
 */
export const PROPERTY_COMPOUND_CATALOG = [
  { key: "background", nodeStorage: "layered" },
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
 * The facet whose value selects a compound layer's shape. Background layers are
 * typed by an explicit `kind`; every other compound selects a theme `preset`.
 */
export const COMPOUND_SELECTOR_FACET: Record<string, string> = {
  background: "kind",
}

/** Returns the selector facet for a compound parent, defaulting to `preset`. */
export function getCompoundSelectorFacet(propertyKey: string): string {
  return COMPOUND_SELECTOR_FACET[propertyKey] ?? "preset"
}

/**
 * Facet display order for each compound parent, used to sort sub-property rows
 * in property inspectors. `preset` stays first. Facets not listed keep their
 * existing relative order after the listed ones. The four border-side compounds
 * share the `border` facet set.
 */
export const COMPOUND_FACET_DISPLAY_ORDER: Record<string, readonly string[]> = {
  background: [
    "kind",
    "color",
    "brightness",
    "image",
    "blendMode",
    "size",
    "position",
    "repeat",
    "filter",
    "opacity",
    "preset",
    "shape",
    "radialSize",
    "positionX",
    "positionY",
    "angle",
    "conicRepeat",
    "startPosition",
    "startColor",
    "startBrightness",
    "startOpacity",
    "endPosition",
    "endColor",
    "endBrightness",
    "endOpacity",
  ],
  shadow: [
    "preset",
    "style",
    "color",
    "brightness",
    "opacity",
    "offsetX",
    "offsetY",
    "blur",
    "spread",
  ],
  border: ["preset", "style", "color", "width", "brightness", "opacity"],
  borderTop: ["preset", "style", "color", "width", "brightness", "opacity"],
  borderRight: ["preset", "style", "color", "width", "brightness", "opacity"],
  borderBottom: ["preset", "style", "color", "width", "brightness", "opacity"],
  borderLeft: ["preset", "style", "color", "width", "brightness", "opacity"],
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
