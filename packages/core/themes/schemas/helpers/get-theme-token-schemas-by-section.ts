import { isLookSection } from "../../looks/look-facets"
import {
  generateComputedSchemas,
  generateLookSchemas,
  generateScaleSchemas,
  generateSwatchSchemas,
  isScaleSchemaSection,
} from "../data/theme-dynamic-schemas"
import { THEME_TOKEN_SCHEMAS } from "../data/theme-token-schemas"
import { resolveThemeTokenSchema } from "./resolve-theme-token-schema"

import type {
  ThemeTokenSchema,
  ThemeTokenSchemaUnresolved,
  ThemeTokenSectionId,
} from "../../types/schema"
import type { ComputedTheme, StockTheme } from "../../types/theme"

export function getThemeTokenSchemasBySection(
  sectionId: ThemeTokenSectionId,
  theme?: StockTheme | ComputedTheme,
): ThemeTokenSchema[] {
  const schemas: ThemeTokenSchema[] = []

  Object.values(THEME_TOKEN_SCHEMAS).forEach((schema) => {
    if (schema.section === sectionId) {
      schemas.push(resolveThemeTokenSchema(schema as ThemeTokenSchemaUnresolved))
    }
  })

  if (theme) {
    let dynamicSchemas: ThemeTokenSchemaUnresolved[] = []

    if (sectionId === "computed") {
      dynamicSchemas = generateComputedSchemas(theme)
    } else if (sectionId === "swatch") {
      dynamicSchemas = generateSwatchSchemas(theme)
    } else if (isLookSection(sectionId)) {
      dynamicSchemas = generateLookSchemas(theme, sectionId)
    } else if (isScaleSchemaSection(sectionId)) {
      dynamicSchemas = generateScaleSchemas(theme, sectionId)
    }

    schemas.push(...dynamicSchemas.map((s) => resolveThemeTokenSchema(s)))
  }

  return schemas.sort((a, b) => a.order - b.order)
}
