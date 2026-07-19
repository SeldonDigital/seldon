import { computed, ref } from "vue"
import { catalog } from "@seldon/core/components/catalog"
import { ComponentId } from "@seldon/core/components/constants"
import type { ComponentSchema } from "@seldon/core/components/types"

export type CatalogItem = {
  componentId: ComponentId
  name: string
  description: string
}

export type CatalogCategory = {
  category: string
  items: CatalogItem[]
}

export type CatalogPredicate = (schema: ComponentSchema) => boolean

const categoryConfigs = [
  { category: "Screens", schemas: catalog.screens },
  { category: "Modules", schemas: catalog.modules },
  { category: "Parts", schemas: catalog.parts },
  { category: "Elements", schemas: catalog.elements },
  { category: "Primitives", schemas: catalog.primitives },
  { category: "Frames", schemas: catalog.frames },
]

/**
 * Builds catalog categories for a component picker plus a reactive search query.
 * Mirrors the React `useDialog`: the caller supplies the visibility predicate
 * (add-board scoping vs. insertion validation), and the predicate reads reactive
 * state so the categories recompute when the workspace or target changes.
 */
export function useCatalogDialog(shouldShow: CatalogPredicate) {
  const query = ref("")

  const categories = computed<CatalogCategory[]>(() => {
    const queryLower = query.value.toLowerCase()
    return categoryConfigs.map(({ category, schemas }) => {
      const items = schemas
        .filter((schema) => shouldShow(schema))
        .map((schema) => ({
          componentId: schema.id,
          name: schema.name,
          description: "Default",
        }))
        .filter((item) => {
          if (queryLower.length === 0) return true
          return (
            item.name.toLowerCase().includes(queryLower) ||
            item.componentId.toLowerCase().includes(queryLower)
          )
        })
      return { category, items }
    })
  })

  return { categories, query }
}
