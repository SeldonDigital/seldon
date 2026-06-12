import { isLookSection } from "../../looks/look-facets"
import type {
  ThemeTokenSchema,
  ThemeTokenSchemaUnresolved,
  ThemeTokenSectionId,
} from "../../types/schema"
import type { ComputedTheme, StockTheme } from "../../types/theme"
import {
  generateLookSchemas,
  generateScaleSchemas,
  generateSwatchSchemas,
  isScaleSchemaSection,
} from "../data/theme-dynamic-schemas"
import { THEME_TOKEN_SCHEMAS } from "../data/theme-token-schemas"
import { resolveThemeTokenSchema } from "./resolve-theme-token-schema"

export function getThemeTokenSchemasBySection(
  sectionId: ThemeTokenSectionId,
  theme?: StockTheme | ComputedTheme,
): ThemeTokenSchema[] {
  const schemas: ThemeTokenSchema[] = []

  Object.values(THEME_TOKEN_SCHEMAS).forEach((schema) => {
    if (schema.section === sectionId) {
      schemas.push(
        resolveThemeTokenSchema(schema as ThemeTokenSchemaUnresolved),
      )
    }
  })

  if (theme) {
    let dynamicSchemas: ThemeTokenSchemaUnresolved[] = []

    if (sectionId === "swatch") {
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
