/**
 * Static theme token catalog entries for fixed `StockTheme` paths (core, modulation steps, font stacks).
 * Entries that vary per theme instance are built in `theme-dynamic-schemas.ts`.
 */
import type { ThemeTokenSchema } from "../../types/schema"
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

/**
 * Shared control config for scale `.step` rows (modulation step input).
 * Static reserved rows and dynamic custom rows both use this so the input stays
 * consistent across the editor.
 */
export const SCALE_STEP_ROW_CONTROL = {
  valueType: "number",
  controlType: "number",
  unit: { type: "none", min: -20, max: 20, step: 0.01 },
} as const

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
        valueType: SCALE_STEP_ROW_CONTROL.valueType,
        controlType: SCALE_STEP_ROW_CONTROL.controlType,
        unit: SCALE_STEP_ROW_CONTROL.unit,
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
      valueType: SCALE_STEP_ROW_CONTROL.valueType,
      controlType: SCALE_STEP_ROW_CONTROL.controlType,
      unit: SCALE_STEP_ROW_CONTROL.unit,
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
      valueType: SCALE_STEP_ROW_CONTROL.valueType,
      controlType: SCALE_STEP_ROW_CONTROL.controlType,
      unit: SCALE_STEP_ROW_CONTROL.unit,
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
      icon: "seldon-step",
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
