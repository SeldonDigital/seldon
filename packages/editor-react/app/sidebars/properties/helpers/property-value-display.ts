import { FlatProperty } from "./properties-data"

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
    (property.key === "colorHarmony.baseColor" ||
      property.key === "colorHarmony.whitePoint" ||
      property.key === "colorHarmony.grayPoint" ||
      property.key === "colorHarmony.blackPoint") &&
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
