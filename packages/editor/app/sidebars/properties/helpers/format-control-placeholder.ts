import { FlatProperty } from "./properties-data"

interface FormatControlPlaceholderInput {
  placeholder: string
  controlType: FlatProperty["controlType"]
  units: string[]
}

/**
 * Formats the placeholder for a property control. Picker controls show none;
 * number controls append their allowed units when the base placeholder omits
 * them.
 */
export function formatControlPlaceholder({
  placeholder,
  controlType,
  units,
}: FormatControlPlaceholderInput): string {
  if (controlType === "combo" || controlType === "menu") {
    return ""
  }

  if (controlType === "number" && units.length > 0) {
    const placeholderHasUnits = units.some((unit) => placeholder.includes(unit))
    if (!placeholderHasUnits) {
      return `${placeholder} (${units.join(", ")})`
    }
  }

  return placeholder
}
