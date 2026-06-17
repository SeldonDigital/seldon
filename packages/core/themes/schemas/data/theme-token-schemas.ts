import type { ThemeTokenSchema } from "../../types/schema"
import {
  blurSchemas,
  borderWidthSchemas,
  coreSchemas,
  cornersSchemas,
  dimensionSchemas,
  fontSizeSchemas,
  fontWeightSchemas,
  gapSchemas,
  lineHeightSchemas,
  marginSchemas,
  paddingSchemas,
  sizeSchemas,
  spreadSchemas,
} from "./theme-static-schemas"

/**
 * Static theme token schema catalog (`ThemeTokenSchema.key` → schema). Dynamic catalog entries
 * are added per section when a theme is passed to `getThemeTokenSchemasBySection`.
 */
export const THEME_TOKEN_SCHEMAS: Record<string, ThemeTokenSchema> = {}

/** Static theme token schema catalog: same map as {@link THEME_TOKEN_SCHEMAS}. */
export const THEME_TOKEN_SCHEMA_CATALOG = THEME_TOKEN_SCHEMAS

const allStaticSchemas = [
  ...coreSchemas,
  ...sizeSchemas,
  ...dimensionSchemas,
  ...marginSchemas,
  ...paddingSchemas,
  ...gapSchemas,
  ...borderWidthSchemas,
  ...cornersSchemas,
  ...fontSizeSchemas,
  ...lineHeightSchemas,
  ...fontWeightSchemas,
  ...blurSchemas,
  ...spreadSchemas,
]

allStaticSchemas.forEach((schema) => {
  THEME_TOKEN_SCHEMAS[schema.key] = schema
})
