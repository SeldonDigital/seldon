import { Theme, ValueType } from "@seldon/core"
import {
  formatHSLColor,
  getFriendlyThemeValueName,
  isHSLColorObject,
} from "../../shared-utils"

export interface PropertyOption {
  value: string
  name: string
}

/**
 * Gets current value option if it's a custom value that can be displayed
 * @param property - Property object containing the value to format
 * @param theme - Optional theme for friendly name generation
 * @returns Formatted property option or null if not applicable
 */
export function getCurrentValueOption(
  property: { value: unknown },
  theme?: Theme,
): PropertyOption | null {
  if (
    !property.value ||
    typeof property.value !== "object" ||
    property.value === null ||
    !("type" in property.value) ||
    (property.value.type !== ValueType.EXACT &&
      property.value.type !== ValueType.PRESET)
  ) {
    return null
  }

  const value = "value" in property.value ? property.value.value : null
  if (!value) return null

  if (typeof value === "string") {
    if (value.startsWith("@")) {
      const parts = value.split(".")
      if (parts.length >= 2) {
        const valueName = parts[parts.length - 1]
        const friendlyName = getFriendlyThemeValueName(valueName, theme!)
        return { value, name: friendlyName }
      }
    }
    return { value, name: getFriendlyThemeValueName(value, theme!) }
  }

  if (typeof value === "boolean") {
    return {
      value: String(value),
      name: value ? "On" : "Off",
    }
  }

  if (typeof value === "object" && value !== null) {
    if (isHSLColorObject(value)) {
      const colorString = formatHSLColor(value)
      return { value: colorString, name: colorString }
    }

    if ("value" in value && "unit" in value) {
      const dimensionString = `${value.value}${value.unit}`
      return { value: dimensionString, name: dimensionString }
    }
  }

  return null
}
