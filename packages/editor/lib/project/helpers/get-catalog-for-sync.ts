import { catalog } from "@seldon/core/components/catalog"
import { stockThemes } from "@seldon/core/themes"
import aiActionSchema from "@seldon/core/workspace/reducers/ai/generated-ai-action-schema.json"
import { generateThemeValues } from "./generate-theme-values"

export async function getCatalogForSync() {
  const components = Object.values(catalog).flat()

  return {
    components: components,
    themes: stockThemes.map((theme) => generateThemeValues(theme)),
    actions: aiActionSchema,
  }
}
