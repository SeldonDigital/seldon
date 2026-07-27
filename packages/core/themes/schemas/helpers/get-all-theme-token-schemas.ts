import { getAllThemeTokenSectionSchemas } from "../sections"
import { getThemeTokenSchemasBySection } from "./get-theme-token-schemas-by-section"

import type { ThemeTokenSchema } from "../../types/schema"
import type { ComputedTheme, StockTheme } from "../../types/theme"

export function getAllThemeTokenSchemas(theme: StockTheme | ComputedTheme): ThemeTokenSchema[] {
  const schemas: ThemeTokenSchema[] = []
  const sections = getAllThemeTokenSectionSchemas()

  for (const section of sections) {
    const sectionSchemas = getThemeTokenSchemasBySection(section.id, theme)

    schemas.push(...sectionSchemas)
  }

  return schemas
}
