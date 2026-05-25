import { catalog } from "@seldon/core/components/catalog"
import { stockThemes } from "@seldon/core/themes"
import workspaceActionSchema from "@seldon/core/workspace/reducers/generated-workspace-action-schema.json"
import { generateThemeValues } from "./generate-theme-values"

export async function getCatalogForSync() {
  const components = Object.values(catalog).flat()

  return {
    components: components,
    themes: stockThemes.map((theme) => generateThemeValues(theme)),
    actions: workspaceActionSchema,
  }
}
