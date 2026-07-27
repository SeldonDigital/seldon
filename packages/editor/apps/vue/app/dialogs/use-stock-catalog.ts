import type {
  CatalogDialogCategory,
  CatalogDialogItem,
} from "@app/dialogs/types"
import { type MaybeRefOrGetter, computed, ref, toValue } from "vue"

/**
 * Shared picker state for the stock board dialogs (themes, font collections,
 * icon sets). Callers pass the already-offerable items for a single category,
 * and this hook owns the search query and the query filtering. Vue port of the
 * React `useStockCatalog`.
 */
export function useStockCatalog(input: {
  category: string
  items: MaybeRefOrGetter<CatalogDialogItem[]>
}) {
  const query = ref("")

  const categories = computed<CatalogDialogCategory<CatalogDialogItem>[]>(
    () => {
      const queryLower = query.value.toLowerCase()
      const filtered = toValue(input.items).filter(
        (item) =>
          query.value.length === 0 ||
          item.name.toLowerCase().includes(queryLower) ||
          item.description.toLowerCase().includes(queryLower),
      )
      return [{ category: input.category, items: filtered }]
    },
  )

  return { categories, query }
}
