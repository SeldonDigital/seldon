import { useMemo, useState } from "react"

import { CatalogDialogCategory, CatalogDialogItem } from "../types"

/**
 * Shared picker state for the stock board dialogs (themes, font collections,
 * icon sets). Callers pass the already-offerable items for a single category,
 * and this hook owns the search query and the query filtering.
 */
export function useStockCatalog({
  category,
  items,
}: {
  category: string
  items: CatalogDialogItem[]
}) {
  const [query, setQuery] = useState("")

  const categories: CatalogDialogCategory<CatalogDialogItem>[] = useMemo(() => {
    const queryLower = query.toLowerCase()
    const filtered = items.filter(
      (item) =>
        query.length === 0 ||
        item.name.toLowerCase().includes(queryLower) ||
        item.description.toLowerCase().includes(queryLower),
    )

    return [{ category, items: filtered }]
  }, [category, items, query])

  return { categories, query, setQuery }
}
