import { PropertySchema } from "@seldon/core/properties/types/schema"
import { PropertyOption } from "../formatters/option-normalizer"

/**
 * Builds default and inherit options for property selection
 * @param schema - Property schema containing support information
 * @returns Array of default options including "Default" and optionally "Inherit"
 */
export function buildDefaultOptions(schema: PropertySchema): PropertyOption[] {
  const defaultGroup = [{ value: "", name: "Default" }]

  if (schema.supports.includes("inherit")) {
    defaultGroup.push({ value: "inherit", name: "Inherit" })
  }

  return defaultGroup
}
