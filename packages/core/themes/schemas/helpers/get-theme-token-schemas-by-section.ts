import type { ComputedTheme, StockTheme } from "../../types/theme"
import type {
  ThemeTokenSchema,
  ThemeTokenSchemaUnresolved,
  ThemeTokenSectionId,
} from "../../types/schema"
import {
  generateBackgroundSchemas,
  generateBorderSchemas,
  generateFontSchemas,
  generateGradientSchemas,
  generateScrollbarSchemas,
  generateShadowSchemas,
  generateSwatchSchemas,
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

    switch (sectionId) {
      case "swatch":
        dynamicSchemas = generateSwatchSchemas(theme)
        break
      case "shadow":
        dynamicSchemas = generateShadowSchemas(theme)
        break
      case "border":
        dynamicSchemas = generateBorderSchemas(theme)
        break
      case "gradient":
        dynamicSchemas = generateGradientSchemas(theme)
        break
      case "background":
        dynamicSchemas = generateBackgroundSchemas(theme)
        break
      case "font":
        dynamicSchemas = generateFontSchemas(theme)
        break
      case "scrollbar":
        dynamicSchemas = generateScrollbarSchemas(theme)
        break
    }

    schemas.push(...dynamicSchemas.map((s) => resolveThemeTokenSchema(s)))
  }

  return schemas.sort((a, b) => a.order - b.order)
}
