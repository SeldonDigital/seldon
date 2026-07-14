import { catalog } from "@seldon/core/components/catalog/index"
import { FONT_COLLECTIONS } from "@seldon/core/font-collections/catalog/index"
import { ICON_SETS } from "@seldon/core/icon-sets/catalog/index"
import { THEMES } from "@seldon/core/themes/catalog/index"

import { redactValue } from "../redact"
import type { ToolContext } from "./context"

export const listCatalogInputSchema = {}

/**
 * The list_catalog tool, deliberately shallow: component ids grouped by level,
 * stock theme identities, icon-set and font-collection names with counts
 * only — never icon or font contents. Depth comes from search_catalog /
 * get_component_schema / get_computed_theme, each priced per use.
 */
export interface ListCatalogResult {
  /** Component ids by level, smallest building block first. */
  components: Record<string, string[]>
  themes: Array<{ id: string; name: string; intent: string }>
  iconSets: Array<{ id: string; name: string; iconCount: number }>
  fontCollections: Array<{ id: string; name: string; familyCount: number }>
}

export function listCatalog(_ctx: ToolContext): ListCatalogResult {
  const components: Record<string, string[]> = {}
  const buckets = [
    catalog.primitives,
    catalog.elements,
    catalog.parts,
    catalog.modules,
    catalog.frames,
    catalog.screens,
    catalog.boards,
  ]
  for (const bucket of buckets) {
    for (const schema of bucket) {
      ;(components[schema.level] ??= []).push(schema.id)
    }
  }

  return redactValue({
    components,
    themes: THEMES.map((theme) => ({
      id: theme.id,
      name: theme.metadata.name,
      intent: theme.metadata.intent,
    })),
    iconSets: ICON_SETS.map((set) => ({
      id: set.id,
      name: set.metadata.name,
      iconCount: set.icons.length,
    })),
    fontCollections: FONT_COLLECTIONS.map((collection) => ({
      id: collection.id,
      name: collection.metadata.name,
      familyCount: Object.keys(collection.families).length,
    })),
  })
}
