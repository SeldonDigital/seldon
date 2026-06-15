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
      "borderTopCollapse",
      "borderRightPreset",
      "borderRightStyle",
      "borderRightColor",
      "borderRightWidth",
      "borderRightBrightness",
      "borderRightOpacity",
      "borderRightCollapse",
      "borderBottomPreset",
      "borderBottomStyle",
      "borderBottomColor",
      "borderBottomWidth",
      "borderBottomBrightness",
      "borderBottomOpacity",
      "borderBottomCollapse",
      "borderLeftPreset",
      "borderLeftStyle",
      "borderLeftColor",
      "borderLeftWidth",
      "borderLeftBrightness",
      "borderLeftOpacity",
      "borderLeftCollapse",
      "corners",
      "borderCollapse",
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
      "textAlign",
      "textDecoration",
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
