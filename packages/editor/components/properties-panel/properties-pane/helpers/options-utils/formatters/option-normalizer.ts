import { Theme } from "@seldon/core"
import { getFriendlyThemeValueName } from "../../shared-utils"

export interface PropertyOption {
  value: string
  name: string
}

/**
 * Normalizes options to consistent format and filters by allowed values
 * @param options - Array of options in various formats (objects, strings, booleans)
 * @param allowedValues - Optional array of allowed values to filter against
 * @param theme - Optional theme for friendly name generation
 * @returns Array of normalized property options
 */
export function normalizeOptions(
  options: unknown[],
  allowedValues?: string[],
  theme?: Theme,
): PropertyOption[] {
  const normalizedOptions = options.map((option) => {
    if (
      typeof option === "object" &&
      option !== null &&
      "name" in option &&
      "value" in option
    ) {
      return option
    }

    if (typeof option === "boolean") {
      return {
        name: option ? "On" : "Off",
        value: String(option),
      }
    }

    return {
      name: getFriendlyThemeValueName(String(option), theme!),
      value: String(option),
    }
  })

  const validOptions = normalizedOptions.filter((option) => {
    return (
      option &&
      option.name &&
      typeof option.name === "string" &&
      option.name.trim() !== "" &&
      option.value !== null &&
      option.value !== undefined &&
      String(option.value).trim() !== ""
    )
  })

  if (allowedValues && allowedValues.length > 0) {
    return validOptions.filter((option) =>
      allowedValues.includes(String(option.value)),
    ) as PropertyOption[]
  }

  return validOptions as PropertyOption[]
}
