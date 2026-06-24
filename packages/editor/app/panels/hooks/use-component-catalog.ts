import { useMemo, useState } from "react"
import { catalog } from "@seldon/core/components/catalog"
import { ComponentId } from "@seldon/core/components/constants"
import { ComponentSchema } from "@seldon/core/components/types"
import { getComponentIcon } from "@seldon/core/icon-registry"
import { VariantId } from "@seldon/core/index"
import { getBoardVariantRootIds } from "@seldon/core/workspace/helpers/components/get-board-variant-root-ids"
import { getVariantById } from "@seldon/core/workspace/helpers/general/get-variant-by-id"
import { isSpecialBoardVariant } from "@seldon/core/workspace/helpers/general/is-special-board-variant"
import { typeCheckingService } from "@seldon/core/workspace/services"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import {
  CatalogPanelCategory,
  CatalogPanelItem,
} from "../catalog-panel/CatalogPanel"

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
 * Builds catalog categories for the component picker, plus the search query
 * that `CatalogPanel` renders.
 */
export function useComponentCatalog({
  shouldShowComponent,
}: {
  shouldShowComponent: FilterComponentPredicate
}) {
  const { workspace } = useWorkspace()
  const [query, setQuery] = useState("")

  const categories: CatalogPanelCategory<CatalogComponentItem>[] =
    useMemo(() => {
      return categoryConfigs.map(({ category, schemas }) => {
        const items: CatalogComponentItem[] = schemas
          .filter((schema) => shouldShowComponent(schema))
          .flatMap((schema): CatalogComponentItem[] => {
            const board = workspace.boards[schema.id]

            if (board) {
              // If board exists, get all variants
              return getBoardVariantRootIds(board).map((variantId) => {
                const variant = getVariantById(variantId, workspace)
                // For special board variants, use the actual label even for default variants
                // For regular boards, show "Default" for default variants
                const isSpecial = isSpecialBoardVariant(variant, workspace)
                const description =
                  typeCheckingService.isDefaultVariant(variant) && !isSpecial
                    ? "Default"
                    : variant.label
                return {
                  id: variantId,
                  componentId: schema.id,
                  variantId,
                  name: schema.name,
                  icon: getComponentIcon(schema.id),
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
                icon: getComponentIcon(schema.id),
                description: "Default",
              },
            ]
          })
          // Filter out components based on the query
          .filter((item) => {
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
    }, [shouldShowComponent, query, workspace])

  return { categories, query, setQuery }
}
