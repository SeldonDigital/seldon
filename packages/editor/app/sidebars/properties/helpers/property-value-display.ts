import { ValueType } from "@seldon/core"
import { isAtomicValue } from "@seldon/core/helpers/type-guards/value/is-atomic-value"
import { resolveUnitFromValue } from "../hooks/use-property-control-data"
import { FlatProperty } from "./properties-data"

const DISPLAY_UNIT_SUFFIXES = ["px", "rem", "%", "deg"]

/**
 * True when the property's active value is an exact numeric value, including a
 * shorthand dimension that resolves to a single unit. Drives whether the unit
 * label (PX/REM) renders.
 */
export function isNumericPropertyValue(property: FlatProperty): boolean {
  const { value } = property
  if (!value || typeof value !== "object") {
    return false
  }
  if (isAtomicValue(value) && value.type === ValueType.EXACT) {
    if (typeof value.value === "number") {
      return true
    }
    if (
      typeof value.value === "object" &&
      value.value !== null &&
      "unit" in value.value &&
      typeof value.value.value === "number"
    ) {
      return true
    }
  }
  // Shorthand dimensions (margin, padding, ...) resolve to a single unit.
  return property.isShorthand && resolveUnitFromValue(value) !== undefined
}

/**
 * Strips a trailing unit suffix from a display value when a separate unit label
 * is shown, avoiding redundant output like "10px PX".
 */
export function stripDisplayUnitSuffix(
  value: string,
  unit: string | undefined,
  isNumeric: boolean,
): string {
  if (!unit || !isNumeric || !value) {
    return value
  }
  for (const suffix of DISPLAY_UNIT_SUFFIXES) {
    if (value.toLowerCase().endsWith(suffix)) {
      return value.slice(0, -suffix.length).trim()
    }
  }
  return value
}

/**
 * Resolves the color for the value-cell icon (icon2). Swatch chips win, then
 * swatch tokens, then color-point tokens, then the row label color.
 */
export function getPropertyIcon2Color(
  property: FlatProperty,
  swatchChipColor: string | undefined,
  labelColor: string | undefined,
): string | undefined {
  if (swatchChipColor) {
    return swatchChipColor
  }
  if (property.key.startsWith("swatch.") && property.actualValue) {
    return property.actualValue as string
  }
  if (
    (property.key === "color.baseColor" ||
      property.key === "color.whitePoint" ||
      property.key === "color.grayPoint" ||
      property.key === "color.blackPoint") &&
    property.iconColorValue
  ) {
    return property.iconColorValue
  }
  return labelColor || undefined
}

/** True when the property uses a menu or combo control. */
export function isMenuOrComboControl(property: FlatProperty): boolean {
  return property.controlType === "menu" || property.controlType === "combo"
}
