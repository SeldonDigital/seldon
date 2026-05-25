/**
 * Formats preset property values for display in the UI.
 *
 * Converts various value formats to human-readable Title Case:
 * - Kebab-case: "evenly-spaced" → "Evenly Spaced"
 * - CamelCase: "imageFit" → "Image Fit"
 * - Custom values: "custom1" → "Custom 1"
 * - Simple values: "fit" → "Fit"
 *
 * @param presetValue - The preset value to format (e.g., "fit", "evenly-spaced", "imageFit")
 * @returns Formatted display string in Title Case
 *
 * @example
 * ```typescript
 * formatPresetValue("fit") // Returns: "Fit"
 * formatPresetValue("evenly-spaced") // Returns: "Evenly Spaced"
 * formatPresetValue("imageFit") // Returns: "Image Fit"
 * formatPresetValue("custom1") // Returns: "Custom 1"
 * ```
 */
export function formatPresetValue(presetValue: string): string {
  if (!presetValue) return presetValue

  // Handle custom values
  if (presetValue.startsWith("custom")) {
    const number = presetValue.replace("custom", "")
    return `Custom ${number}`
  }

  // Convert kebab-case to Title Case
  if (presetValue.includes("-")) {
    return presetValue
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Convert camelCase to Title Case
  const camelCaseRegex = /([a-z])([A-Z])/g
  const spaced = presetValue.replace(camelCaseRegex, "$1 $2")

  // Capitalize first letter
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}
