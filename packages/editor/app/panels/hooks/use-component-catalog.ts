import { Target } from "@lib/types"
import { useCallback, useMemo, useState } from "react"
import { catalog } from "@seldon/core/components/catalog"
import { ComponentId } from "@seldon/core/components/constants"
import { ComponentSchema } from "@seldon/core/components/types"
import { VariantId } from "@seldon/core/index"
import { getBoardVariantRootIds } from "@seldon/core/workspace/helpers/components/get-board-variant-root-ids"
import { getVariantById } from "@seldon/core/workspace/helpers/general/get-variant-by-id"
import { isSpecialBoardVariant } from "@seldon/core/workspace/helpers/general/is-special-board-variant"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useSearchComponents } from "@lib/api/hooks/use-search-components"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { CatalogPanelCategory, CatalogPanelItem } from "../catalog-panel/CatalogPanel"

export type CatalogComponentItem = CatalogPanelItem & {
  componentId: ComponentId
  variantId?: VariantId
}

export type FilterComponentPredicate = (schema: ComponentSchema) => boolean

const categoryConfigs = [
  { category: "Screens", schemas: catalog.screens },
  { category: "Modules", schemas: catalog.modules },
  { category: "Parts", schemas: catalog.parts },
  { category: "Elements", schemas: catalog.elements },
  { category: "Primitives", schemas: catalog.primitives },
  { category: "Frames", schemas: catalog.frames },
]

/**
 * Builds catalog categories for the component picker, plus the search query and
 * AI search trigger that `CatalogPanel` renders.
 */
export function useComponentCatalog({
  shouldShowComponent,
  task,
  target,
}: {
  shouldShowComponent: FilterComponentPredicate
  task: "search_all" | "search_catalog"
  target?: Target | null
}) {
  const { workspace } = useWorkspace()
  const [query, setQuery] = useState("")
  // We filter the results based on the query until the user submits the query
  // after which we will filter the results based on response from the AI.
  const [filterType, setFilterType] = useState<"query" | "ai">("query")
  const { data, refetch, isFetching } = useSearchComponents({
    query,
    task,
    targetNode: target?.nodeId,
    targetIndex: target?.index,
  })

  const submit = useCallback(() => {
    setFilterType("ai")
    refetch()
  }, [refetch])

  const categories: CatalogPanelCategory<CatalogComponentItem>[] = useMemo(() => {
    return categoryConfigs.map(({ category, schemas }) => {
      const items: CatalogComponentItem[] = schemas
        .filter((schema) => shouldShowComponent(schema))
        .flatMap((schema) => {
          const board = workspace.components[schema.id]

          if (board) {
            // If board exists, get all variants
            return getBoardVariantRootIds(board).map((variantId) => {
              const variant = getVariantById(variantId, workspace)
              // For special board variants, use the actual label even for default variants
              // For regular boards, show "Default" for default variants
              const isSpecial = isSpecialBoardVariant(variant, workspace)
              const description =
                workspaceService.isDefaultVariant(variant) && !isSpecial
                  ? "Default"
                  : variant.label
              return {
                id: variantId,
                componentId: schema.id,
                variantId,
                name: schema.name,
                icon: schema.icon,
                description,
              }
            })
          }

          // If no board exists, use default variant
          return [
            {
              id: schema.id,
              componentId: schema.id,
              name: schema.name,
              icon: schema.icon,
              description: "Default",
            },
          ]
        })
        // Filter out components based on the query
        .filter((item) => {
          if (filterType === "ai" && data) {
            if (item.variantId) {
              return data.some(
                (result) =>
                  result.component === item.componentId &&
                  result.variant === item.variantId,
              )
            }

            return data.some(
              (result) =>
                result.component === item.componentId && !item.variantId,
            )
          }

          if (query.length === 0) return true

          const queryLower = query.toLowerCase()
          return (
            item.name.toLowerCase().includes(queryLower) ||
            item.description.toLowerCase().includes(queryLower) ||
            item.variantId?.toLowerCase().includes(queryLower) ||
            item.componentId.toLowerCase().includes(queryLower)
          )
        })

      return { category, items }
    })
  }, [shouldShowComponent, filterType, data, query, workspace])

  return { categories, query, setQuery, submit, isFetching }
}
