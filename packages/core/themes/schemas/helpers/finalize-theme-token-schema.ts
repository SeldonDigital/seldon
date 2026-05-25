import {
  isThemeTokenBoolean,
  isThemeTokenColor,
  isThemeTokenEnumValue,
  isThemeTokenFiniteNumber,
  isThemeTokenPercentageNumber,
  isThemeTokenPxRemLength,
  isThemeTokenText,
} from "../../../properties/schemas/helpers/shared/theme-token-atomic-validators"
import type {
  ThemeTokenCatalogDraft,
  ThemeTokenSchema,
  ThemeTokenSchemaSupport,
  ThemeTokenSchemaValidation,
} from "../../types/schema"

export function buildThemeTokenValidation(
  support: ThemeTokenSchemaSupport,
  options?: ThemeTokenSchema["options"],
): ThemeTokenSchemaValidation {
  switch (support) {
    case "number":
      return { number: isThemeTokenFiniteNumber }
    case "length":
      return { length: isThemeTokenPxRemLength }
    case "percentage":
      return { percentage: isThemeTokenPercentageNumber }
    case "boolean":
      return { boolean: isThemeTokenBoolean }
    case "text":
      return { text: isThemeTokenText }
    case "color":
      return { color: isThemeTokenColor }
    case "enum":
      return {
        enum: (value: unknown) => isThemeTokenEnumValue(value, options),
      }
  }
}

/**
 * Expands authoring drafts (`valueType`) into `supports` + `validation` (property-schema shape).
 */
export function finalizeThemeTokenSchema(
  draft: ThemeTokenCatalogDraft,
): ThemeTokenSchema {
  const { valueType, ...rest } = draft
  return {
    ...rest,
    supports: [valueType],
    validation: buildThemeTokenValidation(valueType, draft.options),
  }
}
