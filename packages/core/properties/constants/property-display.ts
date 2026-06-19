/**
 * Panel display category and global ordering for catalog properties.
 * Mirrors `PROPERTIES.md` → Property Categories (Attributes, Layout, Appearance, Typography, Effects).
 * `PROPERTY_DISPLAY_ORDER` is the source of truth for `PropertySchema.displayCategory` / `displayOrder`.
 * When adding catalog keys, update `schemas/data/property-schemas.ts` and the contributor notes in `PROPERTIES.md` so sections stay aligned.
 */

export const PropertyDisplayCategory = {
  ATTRIBUTES: "attributes",
  LAYOUT: "layout",
  APPEARANCE: "appearance",
  TYPOGRAPHY: "typography",
  EFFECTS: "effects",
} as const

export type PropertyDisplayCategory =
  (typeof PropertyDisplayCategory)[keyof typeof PropertyDisplayCategory]

/**
 * Blocks in panel order; keys within each block match `schemas/data/property-schemas.ts` insertion order.
 */
export const PROPERTY_DISPLAY_ORDER: ReadonlyArray<{
  readonly category: PropertyDisplayCategory
  readonly keys: readonly string[]
}> = [
  {
    category: PropertyDisplayCategory.ATTRIBUTES,
    keys: [
      "display",
      "htmlElement",
      "wrapperElement",
      "content",
      "symbol",
      "source",
      "imageFit",
      "altText",
      "inputType",
      "placeholder",
      "checked",
      "controls",
      "autoPlay",
      "loop",
      "muted",
      "poster",
      "preload",
      "trackKind",
      "srcLang",
      "trackLabel",
      "trackDefault",
      "mediaType",
      "mediaQuery",
      "ariaLabel",
      "ariaHidden",
      "size",
      "buttonSize",
      "boardPreset",
      "boardWidth",
      "boardHeight",
      "screenWidth",
      "screenHeight",
      "cursor",
    ],
  },
  {
    category: PropertyDisplayCategory.LAYOUT,
    keys: [
      "direction",
      "orientation",
      "align",
      "placement",
      "position",
      "width",
      "height",
      "margin",
      "padding",
      "gap",
      "rotation",
      "wrapChildren",
      "clip",
      "columns",
      "rows",
      "columnStart",
      "columnSpan",
      "rowStart",
      "rowSpan",
      "cellAlign",
      "dimension",
      "resize",
      "screenSize",
    ],
  },
  {
    category: PropertyDisplayCategory.APPEARANCE,
    keys: [
      "color",
      "accentColor",
      "brightness",
      "opacity",
      "listStyleType",
      "listStylePosition",
      "backgroundKind",
      "backgroundImage",
      "backgroundPosition",
      "backgroundSize",
      "backgroundRepeat",
      "backgroundColor",
      "backgroundBlendMode",
      "backgroundFilter",
      "backgroundBrightness",
      "backgroundOpacity",
      "backgroundPreset",
      "backgroundGradientType",
      "backgroundAngle",
      "backgroundStartColor",
      "backgroundStartBrightness",
      "backgroundStartOpacity",
      "backgroundStartPosition",
      "backgroundEndColor",
      "backgroundEndBrightness",
      "backgroundEndOpacity",
      "backgroundEndPosition",
      "borderPreset",
      "borderStyle",
      "borderColor",
      "borderWidth",
      "borderBrightness",
      "borderOpacity",
      "borderTopPreset",
      "borderTopStyle",
      "borderTopColor",
      "borderTopWidth",
      "borderTopBrightness",
      "borderTopOpacity",
      "borderRightPreset",
      "borderRightStyle",
      "borderRightColor",
      "borderRightWidth",
      "borderRightBrightness",
      "borderRightOpacity",
      "borderBottomPreset",
      "borderBottomStyle",
      "borderBottomColor",
      "borderBottomWidth",
      "borderBottomBrightness",
      "borderBottomOpacity",
      "borderLeftPreset",
      "borderLeftStyle",
      "borderLeftColor",
      "borderLeftWidth",
      "borderLeftBrightness",
      "borderLeftOpacity",
      "borderCollapse",
      "corners",
    ],
  },
  {
    category: PropertyDisplayCategory.TYPOGRAPHY,
    keys: [
      "fontPreset",
      "fontFamily",
      "fontStyle",
      "fontWeight",
      "fontSize",
      "fontLineHeight",
      "fontTextCase",
      "fontLetterSpacing",
      "textDecoration",
      "textAlign",
      "wrapText",
      "lines",
    ],
  },
  {
    category: PropertyDisplayCategory.EFFECTS,
    keys: [
      "gradientPreset",
      "gradientGradientType",
      "gradientType",
      "gradientAngle",
      "gradientStartColor",
      "gradientStartBrightness",
      "gradientStartOpacity",
      "gradientStartPosition",
      "gradientEndColor",
      "gradientEndBrightness",
      "gradientEndOpacity",
      "gradientEndPosition",
      "gradientStopBrightness",
      "gradientStopColor",
      "gradientStopOpacity",
      "gradientStopPosition",
      "shadowPreset",
      "shadowStyle",
      "shadowOffsetX",
      "shadowOffsetY",
      "shadowBlur",
      "shadowColor",
      "shadowBrightness",
      "shadowOpacity",
      "shadowSpread",
      "scroll",
      "scrollbarStyle",
    ],
  },
]

/**
 * Leading node-entry fields shown in the inspector before the property rows.
 * These are node metadata (not `Properties` keys), so they live here as their
 * own order instead of in `PROPERTY_DISPLAY_ORDER`. Theme is always pinned
 * first; every other field follows in alphabetical order. The editor renders
 * one row per id in this order, ahead of the Attributes block.
 */
export const NODE_FIELD_DISPLAY_ORDER = ["theme", "reference"] as const

export type NodeFieldDisplayId = (typeof NODE_FIELD_DISPLAY_ORDER)[number]

export type PropertyDisplayMeta = {
  displayCategory: PropertyDisplayCategory
  displayOrder: number
}

function buildPropertyDisplayMeta(): Record<string, PropertyDisplayMeta> {
  const out: Record<string, PropertyDisplayMeta> = {}
  let displayOrder = 0
  for (const block of PROPERTY_DISPLAY_ORDER) {
    for (const key of block.keys) {
      out[key] = { displayCategory: block.category, displayOrder }
      displayOrder += 1
    }
  }
  return out
}

export const PROPERTY_DISPLAY_META: Record<string, PropertyDisplayMeta> =
  buildPropertyDisplayMeta()

export function attachPropertyDisplayMetadata<
  const T extends Record<string, object>,
>(
  schemas: T,
): {
  [K in keyof T]: T[K] & PropertyDisplayMeta
} {
  const schemaKeys = Object.keys(schemas)
  const metaKeys = Object.keys(PROPERTY_DISPLAY_META)

  const missing = schemaKeys.filter((k) => !PROPERTY_DISPLAY_META[k])
  if (missing.length > 0) {
    throw new Error(
      `PROPERTY_DISPLAY_ORDER missing entries for catalog keys: ${missing.join(", ")}`,
    )
  }

  const extra = metaKeys.filter((k) => !(k in schemas))
  if (extra.length > 0) {
    throw new Error(
      `PROPERTY_DISPLAY_ORDER has keys not present in PROPERTY_SCHEMAS: ${extra.join(", ")}`,
    )
  }

  const result = {} as { [K in keyof T]: T[K] & PropertyDisplayMeta }
  for (const key of schemaKeys) {
    const k = key as keyof T
    result[k] = {
      ...schemas[k],
      ...PROPERTY_DISPLAY_META[key],
    }
  }
  return result
}
