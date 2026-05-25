import { Theme, ValueType } from "@seldon/core"
import { getThemeValueName } from "@seldon/core/helpers/theme"

/**
 * Converts theme value names to friendly, sentence-case names
 * @param valueName - The theme value name or key to convert
 * @param theme - Theme object for name lookup (required)
 * @returns Friendly display name for the theme value
 */
export function getFriendlyThemeValueName(
  valueName: string,
  theme: Theme,
): string {
  return getThemeValueName(valueName, theme)
}

/**
 * Extracts the actual property name from a property key (handles sub-properties)
 * @param propertyKey - The property key to extract name from
 * @returns The actual property name
 */
export function getActualPropertyName(propertyKey: string): string {
  if (propertyKey.includes(".")) {
    const parts = propertyKey.split(".")
    return parts[parts.length - 1]
  }
  return propertyKey.split(".")[0]
}

/**
 * Gets placeholder text for a property control
 * @param property - Property object with value
 * @param defaultPlaceholder - Default placeholder text
 * @returns Placeholder text based on property value
 */
export function getPropertyPlaceholder(
  property: { value: unknown },
  defaultPlaceholder: string,
): string {
  return isValueEmpty(property.value) ? "Default" : defaultPlaceholder
}

/**
 * Formats a property key into a readable label
 * @param propertyKey - The property key to format
 * @returns Formatted property label
 */
export function formatPropertyLabel(propertyKey: string): string {
  return propertyKey
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

/**
 * Creates a special UI presentation label for sub-properties by removing parent text
 * This is editor-only logic to make sub-property labels more concise
 * @param parentPropertyKey - The parent property key (e.g., "margin", "border")
 * @param subPropertyKey - The sub-property key (e.g., "top", "style")
 * @param registryLabel - The full label from registry (e.g., "Margin Top", "Border Style")
 * @returns Simplified label with parent text removed (e.g., "Top", "Style")
 */
export function createSubPropertyLabel(
  parentPropertyKey: string,
  subPropertyKey: string,
  registryLabel?: string,
): string {
  // If we have a registry label, use it as the base
  if (registryLabel) {
    // Remove the parent property name from the label (can be anywhere in the label)
    const parentLabel = formatPropertyLabel(parentPropertyKey)

    // Handle special cases for plural forms
    let parentTextToRemove = parentLabel
    if (parentLabel.endsWith("s") && !parentLabel.endsWith("ss")) {
      // Remove 's' from the end for singular form (e.g., "Corners" -> "Corner")
      parentTextToRemove = parentLabel.slice(0, -1)
    }

    // Remove parent text from anywhere in the label
    let simplifiedLabel = registryLabel
    const parentTextRegex = new RegExp(`\\b${parentTextToRemove}\\b`, "gi")
    simplifiedLabel = simplifiedLabel.replace(parentTextRegex, "").trim()

    // Clean up any double spaces that might have been created
    simplifiedLabel = simplifiedLabel.replace(/\s+/g, " ")

    // If the simplified label is empty or just whitespace, fall back to sub-property key
    if (!simplifiedLabel) {
      return formatPropertyLabel(subPropertyKey)
    }

    return simplifiedLabel
  }

  // Fallback: just format the sub-property key
  return formatPropertyLabel(subPropertyKey)
}

/**
 * Gets the value type from a property value
 * @param value - The property value to check
 * @returns The value type or EMPTY if not found
 */
export function getValueType(value: unknown): ValueType {
  return value && typeof value === "object" && "type" in value
    ? (value.type as ValueType)
    : ValueType.EMPTY
}

/**
 * Checks if a value is empty or unset
 * @param value - The value to check
 * @returns True if the value is empty, null, undefined, or has EMPTY type
 */
export function isValueEmpty(value: unknown): boolean {
  if (!value || value === null || value === undefined) {
    return true
  }
  if (typeof value === "object" && "type" in value) {
    return (value as { type: ValueType }).type === ValueType.EMPTY
  }
  return false
}

/**
 * Formats HSL color object to readable string
 * @param hslObject - The HSL color object to format
 * @returns Formatted HSL string or "Invalid color" if invalid
 */
export function formatHSLColor(hslObject: unknown): string {
  if (
    typeof hslObject === "object" &&
    hslObject !== null &&
    "hue" in hslObject &&
    "saturation" in hslObject &&
    "lightness" in hslObject
  ) {
    const { hue, saturation, lightness } = hslObject
    return `hsl(${hue} ${saturation}% ${lightness}%)`
  }
  return "Invalid color"
}

/**
 * Checks if an object is an HSL color object
 * @param obj - The object to check
 * @returns True if the object has HSL color properties
 */
export function isHSLColorObject(obj: unknown): boolean {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "hue" in obj &&
    "saturation" in obj &&
    "lightness" in obj
  )
}

/**
 * Parses HSL string to HSL object
 * @param hslString - The HSL string to parse
 * @returns HSL object or null if invalid
 */
export function parseHSLString(
  hslString: string,
): { hue: number; saturation: number; lightness: number } | null {
  const match = hslString.match(
    /^hsl\(\s*(\d+)(?:deg)?\s*[,]?\s*(\d+)%?\s*[,]?\s*(\d+)%?\s*\)$/i,
  )
  if (!match) return null

  const [, hueStr, saturationStr, lightnessStr] = match
  const hue = parseInt(hueStr, 10)
  const saturation = parseInt(saturationStr, 10)
  const lightness = parseInt(lightnessStr, 10)

  if (isNaN(hue) || isNaN(saturation) || isNaN(lightness)) return null
  if (hue < 0 || hue > 360) return null
  if (saturation < 0 || saturation > 100) return null
  if (lightness < 0 || lightness > 100) return null

  return { hue, saturation, lightness }
}

/**
 * Checks if a string is an HSL color string
 * @param value - The string to check
 * @returns True if the string matches HSL format
 */
export function isHSLString(value: string): boolean {
  return /^hsl\(\s*\d+(?:deg)?\s*[,]?\s*\d+%?\s*[,]?\s*\d+%?\s*\)$/i.test(value)
}
