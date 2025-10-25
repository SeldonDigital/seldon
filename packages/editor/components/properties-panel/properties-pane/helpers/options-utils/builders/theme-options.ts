import { PropertySchema, Theme } from "@seldon/core"
import { getFriendlyThemeValueName } from "../../shared-utils"
import { PropertyOption } from "../formatters/option-normalizer"

/**
 * Sorts swatch keys with standard swatches first, then custom swatches numerically
 * @param themeKeys - Array of theme keys to sort
 * @returns Sorted array with standard swatches first, then custom swatches
 */
function sortSwatchKeys(themeKeys: string[]): string[] {
  const standardSwatches = themeKeys.filter((key) => !key.startsWith("custom"))
  const customSwatches = themeKeys.filter((key) => key.startsWith("custom"))

  const sortedCustom = customSwatches.sort((a, b) => {
    const numA = parseInt(a.replace("custom", ""))
    const numB = parseInt(b.replace("custom", ""))
    return numA - numB
  })

  return [...standardSwatches, ...sortedCustom]
}

/**
 * Gets the theme section name that contains the specified keys
 * @param schema - Property schema containing theme key functions
 * @param theme - Theme object to search through
 * @param type - Type of theme keys (categorical or ordinal)
 * @returns Theme section name or null if not found
 */
function getThemeSectionFromSchema(
  schema: PropertySchema,
  theme: Theme,
  type: "categorical" | "ordinal",
): string | null {
  const getKeys =
    type === "categorical"
      ? schema.themeCategoricalKeys
      : schema.themeOrdinalKeys
  if (!getKeys) return null

  const keys = getKeys(theme)
  if (keys.length === 0) return null

  // Special cases where schema name doesn't match theme section name
  // TODO: Find a better way to handle this
  const specialMappings: Record<string, string> = {
    color: "swatch",
    fontSize: "fontSize",
    buttonSize: "fontSize",
    corners: "corners",
    shadowBlur: "blur",
    shadowSpread: "spread",
  }

  const propertyName = schema.name
  if (
    specialMappings[propertyName] &&
    theme[specialMappings[propertyName] as keyof Theme]
  ) {
    return specialMappings[propertyName]
  }

  // For most properties, the section name matches the property name
  // Find the theme section that contains all the keys from the schema
  for (const [sectionName, sectionData] of Object.entries(theme)) {
    if (typeof sectionData === "object" && sectionData !== null) {
      const sectionKeys = Object.keys(sectionData)
      if (keys.every((key) => sectionKeys.includes(key))) {
        return sectionName
      }
    }
  }

  return null
}

/**
 * Creates theme options from keys and section with filtering
 * @param themeKeys - Array of theme keys to create options from
 * @param themeSection - Theme section name (e.g., "swatch", "fontSize")
 * @param allowedValues - Optional array of allowed values to filter against
 * @param theme - Optional theme for friendly name generation
 * @returns Array of property options with theme references
 */
function createThemeOptions(
  themeKeys: string[],
  themeSection: string,
  allowedValues?: string[],
  theme?: Theme,
): PropertyOption[] {
  const sortedKeys =
    themeSection === "swatch" ? sortSwatchKeys(themeKeys) : themeKeys

  return sortedKeys
    .map((key) => {
      const themeKey = `@${themeSection}.${key}`
      return {
        value: themeKey,
        name: getFriendlyThemeValueName(themeKey, theme!),
      }
    })
    .filter((option) => {
      if (allowedValues && allowedValues.length > 0) {
        return allowedValues.includes(option.value)
      }
      return true
    })
}

/**
 * Builds theme options from schema for both categorical and ordinal types
 * @param schema - Property schema containing theme key functions
 * @param theme - Theme object to extract values from
 * @param allowedValues - Optional array of allowed values to filter against
 * @returns Array of theme-based property options
 */
export function buildThemeOptions(
  schema: PropertySchema,
  theme: Theme,
  allowedValues?: string[],
): PropertyOption[] {
  const options: PropertyOption[] = []

  if (schema.themeCategoricalKeys) {
    const themeSection = getThemeSectionFromSchema(schema, theme, "categorical")
    if (themeSection) {
      const themeKeys = schema.themeCategoricalKeys(theme)
      options.push(
        ...createThemeOptions(themeKeys, themeSection, allowedValues, theme),
      )
    }
  }

  if (schema.themeOrdinalKeys) {
    const themeSection = getThemeSectionFromSchema(schema, theme, "ordinal")
    if (themeSection) {
      const themeKeys = schema.themeOrdinalKeys(theme)
      options.push(
        ...createThemeOptions(themeKeys, themeSection, allowedValues, theme),
      )
    }
  }

  return options
}
