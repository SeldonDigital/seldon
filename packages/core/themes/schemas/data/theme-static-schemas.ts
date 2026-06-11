/**
 * Static theme token catalog entries for fixed `StockTheme` paths (core, modulation steps, font stacks).
 * Entries that vary per theme instance are built in `theme-dynamic-schemas.ts`.
 */
import { Harmony, Ratio } from "../../constants"
import type {
  ThemeTokenCatalogDraft,
  ThemeTokenSchema,
} from "../../types/schema"
import { finalizeThemeTokenSchema } from "../helpers/finalize-theme-token-schema"
import {
  BORDER_WIDTH_ORDER,
  DIMENSION_ORDER,
  FONT_SIZE_ORDER,
  FONT_WEIGHT_ORDER,
  LINE_HEIGHT_ORDER,
  SIZE_ORDER,
  SPACING_ORDER,
} from "./theme-step-orders"

const coreSchemasRaw: ThemeTokenCatalogDraft[] = [
  {
    key: "core.ratio",
    label: "Ratio",
    valueType: "enum",
    controlType: "combo",
    options: Object.entries(Ratio)
      .filter(([key]) => !key.match(/^\d/))
      .map(([name, value]) => ({
        label: name.replace(/([A-Z])/g, " $1").trim(),
        value: String(value),
      }))
      .filter((opt, index, arr) => {
        return arr.findIndex((o) => o.value === opt.value) === index
      }),
    section: "core",
    order: 0,
  },
  {
    key: "core.fontSize",
    label: "Base Font Size",
    valueType: "number",
    controlType: "number",
    unit: { type: "px", min: 8, max: 32, step: 1 },
    section: "core",
    order: 1,
  },
  {
    key: "core.size",
    label: "Base Size",
    valueType: "number",
    controlType: "number",
    unit: { type: "none", min: 0.5, max: 10, step: 0.1 },
    section: "core",
    order: 2,
  },
  {
    key: "color.baseColor",
    label: "Base Color",
    valueType: "color",
    controlType: "color",
    section: "core",
    order: 3,
  },
  {
    key: "color.harmony",
    label: "Harmony",
    valueType: "enum",
    controlType: "combo",
    options: [
      { label: "Monochromatic", value: String(Harmony.Monochromatic) },
      { label: "Complementary", value: String(Harmony.Complementary) },
      {
        label: "Split Complementary",
        value: String(Harmony.SplitComplementary),
      },
      { label: "Triadic", value: String(Harmony.Triadic) },
      { label: "Analogous", value: String(Harmony.Analogous) },
      { label: "Square", value: String(Harmony.Square) },
    ],
    section: "core",
    order: 4,
  },
  {
    key: "color.angle",
    label: "Angle",
    valueType: "number",
    controlType: "number",
    unit: { type: "deg", min: 0, max: 360, step: 1 },
    section: "core",
    order: 5,
  },
  {
    key: "color.step",
    label: "Step",
    valueType: "number",
    controlType: "number",
    unit: { type: "none", min: -50, max: 50, step: 1 },
    section: "core",
    order: 6,
  },
  {
    key: "color.whitePoint",
    label: "White Point",
    valueType: "percentage",
    controlType: "number",
    unit: { type: "%", min: 0, max: 100, step: 1 },
    section: "core",
    order: 7,
  },
  {
    key: "color.grayPoint",
    label: "Gray Point",
    valueType: "percentage",
    controlType: "number",
    unit: { type: "%", min: 0, max: 100, step: 1 },
    section: "core",
    order: 8,
  },
  {
    key: "color.blackPoint",
    label: "Black Point",
    valueType: "percentage",
    controlType: "number",
    unit: { type: "%", min: 0, max: 100, step: 1 },
    section: "core",
    order: 9,
  },
  {
    key: "color.bleed",
    label: "Bleed",
    valueType: "number",
    controlType: "number",
    unit: { type: "none", min: 0, max: 1, step: 0.01 },
    section: "core",
    order: 10,
  },
  {
    key: "color.contrastRatio",
    label: "Contrast Ratio",
    valueType: "number",
    controlType: "number",
    unit: { type: "none", min: 1, max: 21, step: 0.1 },
    section: "core",
    order: 11,
  },
  {
    key: "fontFamily.primary",
    label: "Primary Font",
    valueType: "text",
    controlType: "menu",
    section: "core",
    order: 12,
  },
  {
    key: "fontFamily.secondary",
    label: "Secondary Font",
    valueType: "text",
    controlType: "menu",
    section: "core",
    order: 13,
  },
]

export const coreSchemas = coreSchemasRaw.map(finalizeThemeTokenSchema)

/** Two catalog keys per ordinal slot: `.step` (modulation step input) and `.parameters` (exact length input). */
function makeScaleSlotSchemas<
  TSection extends
    | "size"
    | "dimension"
    | "margin"
    | "padding"
    | "gap"
    | "corners"
    | "fontSize"
    | "blur"
    | "spread",
>({
  section,
  keys,
}: {
  section: TSection
  keys: readonly string[]
}): ThemeTokenSchema[] {
  return keys.flatMap((key, index) => {
    const label = key.charAt(0).toUpperCase() + key.slice(1)
    const baseOrder = index * 2
    return [
      finalizeThemeTokenSchema({
        key: `${section}.${key}.step`,
        label,
        valueType: "number",
        controlType: "number",
        unit: { type: "none", min: -20, max: 20, step: 0.01 },
        section,
        order: baseOrder,
        icon: "seldon-step",
      }),
      finalizeThemeTokenSchema({
        key: `${section}.${key}.parameters`,
        label: `${label} Value`,
        valueType: "length",
        controlType: "number",
        unit: { type: "rem", min: -9999, max: 9999, step: 0.01 },
        section,
        order: baseOrder + 1,
        icon: "seldon-step",
      }),
    ]
  })
}

export const sizeSchemas: ThemeTokenSchema[] = makeScaleSlotSchemas({
  section: "size",
  keys: SIZE_ORDER,
})

export const dimensionSchemas: ThemeTokenSchema[] = makeScaleSlotSchemas({
  section: "dimension",
  keys: DIMENSION_ORDER,
})

export const marginSchemas: ThemeTokenSchema[] = makeScaleSlotSchemas({
  section: "margin",
  keys: SPACING_ORDER,
})

export const paddingSchemas: ThemeTokenSchema[] = makeScaleSlotSchemas({
  section: "padding",
  keys: SPACING_ORDER,
})

export const gapSchemas: ThemeTokenSchema[] = makeScaleSlotSchemas({
  section: "gap",
  keys: SPACING_ORDER,
})

export const borderWidthSchemas: ThemeTokenSchema[] = BORDER_WIDTH_ORDER.map(
  (key, index) =>
    finalizeThemeTokenSchema({
      key: `borderWidth.${key}.step`,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      valueType: "number",
      controlType: "number",
      unit: { type: "none", min: -20, max: 20, step: 0.01 },
      section: "borderWidth",
      order: index,
      icon: "seldon-step",
    }),
)

export const cornersSchemas: ThemeTokenSchema[] = makeScaleSlotSchemas({
  section: "corners",
  keys: SPACING_ORDER,
})

export const fontSizeSchemas: ThemeTokenSchema[] = makeScaleSlotSchemas({
  section: "fontSize",
  keys: FONT_SIZE_ORDER,
})

export const lineHeightSchemas: ThemeTokenSchema[] = LINE_HEIGHT_ORDER.map(
  (key, index) =>
    finalizeThemeTokenSchema({
      key: `lineHeight.${key}.step`,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      valueType: "number",
      controlType: "number",
      unit: { type: "none", min: -20, max: 20, step: 0.01 },
      section: "lineHeight",
      order: index,
      icon: "seldon-step",
    }),
)

export const fontWeightSchemas: ThemeTokenSchema[] = FONT_WEIGHT_ORDER.map(
  (key, index) =>
    finalizeThemeTokenSchema({
      key: `fontWeight.${key}`,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      valueType: "number",
      controlType: "number",
      unit: { type: "none", min: 100, max: 900, step: 100 },
      section: "fontWeight",
      order: index,
    }),
)

export const blurSchemas: ThemeTokenSchema[] = makeScaleSlotSchemas({
  section: "blur",
  keys: SIZE_ORDER,
})

export const spreadSchemas: ThemeTokenSchema[] = makeScaleSlotSchemas({
  section: "spread",
  keys: SIZE_ORDER,
})
