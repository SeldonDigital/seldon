import { PropertySchema, Theme } from "@seldon/core"
import { normalizeOptions } from "../formatters/option-normalizer"
import { PropertyOption } from "../formatters/option-normalizer"

/**
 * Builds preset options from schema with theme support and fallback handling
 * @param schema - Property schema containing preset options
 * @param allowedValues - Optional array of allowed values to filter against
 * @param theme - Optional theme for value resolution
 * @returns Array of normalized preset options
 */
export function buildPresetOptions(
  schema: PropertySchema,
  allowedValues?: string[],
  theme?: Theme,
): PropertyOption[] {
  if (!schema.presetOptions) {
    return []
  }

  // Some schemas may expose presetOptions as a function that can take a Theme
  let presetOptions: unknown[] = []
  if (typeof schema.presetOptions === "function") {
    presetOptions = (schema.presetOptions as (theme?: Theme) => unknown[])(
      theme,
    )
    if (!Array.isArray(presetOptions)) {
      presetOptions = (schema.presetOptions as () => unknown[])()
    }
  } else {
    presetOptions = schema.presetOptions as unknown[]
  }
  return normalizeOptions(presetOptions, allowedValues, theme)
}
