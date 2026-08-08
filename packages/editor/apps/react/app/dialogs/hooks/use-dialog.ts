import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { useMemo, useState } from "react"

import { catalog } from "@seldon/core/components/catalog"
import { getBoardRowIcon, getComponentIcon } from "@seldon/core/icon-lookup"
import { getBoardVariantRootIds } from "@seldon/core/workspace/helpers/components/get-board-variant-root-ids"
import { getVariantById } from "@seldon/core/workspace/helpers/general/get-variant-by-id"
import { isSpecialBoardVariant } from "@seldon/core/workspace/helpers/general/is-special-board-variant"
import { isAuthoredBoard } from "@seldon/core/workspace/model/components"
import { typeCheckingService } from "@seldon/core/workspace/services"

import type { CatalogDialogCategory, CatalogDialogItem } from "../types"
import type { ComponentId } from "@seldon/core/components/constants"
import type { ComponentSchema } from "@seldon/core/components/types"
import type { VariantId } from "@seldon/core/index"
import type { Board, EntryNodeLevel } from "@seldon/core/workspace/types"

export type CatalogComponentItem = CatalogDialogItem & {
  componentId: ComponentId
  variantId?: VariantId
}

export type FilterComponentPredicate = (schema: ComponentSchema) => boolean

export type FilterAuthoredPredicate = (variantRootId: VariantId) => boolean

const categoryConfigs = [
  { category: "Screens", schemas: catalog.screens },
  { category: "Modules", schemas: catalog.modules },
  { category: "Parts", schemas: catalog.parts },
  { category: "Elements", schemas: catalog.elements },
  { category: "Primitives", schemas: catalog.primitives },
  { category: "Frames", schemas: catalog.frames },
]

/** Maps an authored board's declared level to its catalog picker category. */
const AUTHORED_LEVEL_CATEGORY: Partial<Record<EntryNodeLevel, string>> = {
  screen: "Screens",
  module: "Modules",
  part: "Parts",
  element: "Elements",
}

/**
 * Builds catalog categories for the component picker, plus the search query
 * that `PanelDialogController` renders. When `shouldShowAuthored` is supplied,
 * authored component boards join their declared level's category as insertable
 * variant instances; the add-board dialog omits it and lists catalog schemas
 * only.
 */
export function useDialog({
  shouldShowComponent,
  shouldShowAuthored,
}: {
  shouldShowComponent: FilterComponentPredicate
  shouldShowAuthored?: FilterAuthoredPredicate
}) {
  const { workspace } = useWorkspace()
  const [query, setQuery] = useState("")

  const authoredBoardsByCategory = useMemo(() => {
    const byCategory = new Map<string, Board[]>()

    if (!shouldShowAuthored) return byCategory

    for (const board of Object.values(workspace.boards)) {
      if (!isAuthoredBoard(board)) continue
      const category = AUTHORED_LEVEL_CATEGORY[board.level as EntryNodeLevel]

      if (!category) continue
      const bucket = byCategory.get(category) ?? []

      bucket.push(board)
      byCategory.set(category, bucket)
    }

    return byCategory
  }, [shouldShowAuthored, workspace])

  const categories: CatalogDialogCategory<CatalogComponentItem>[] = useMemo(() => {
    return categoryConfigs.map(({ category, schemas }) => {
      const catalogItems: CatalogComponentItem[] = schemas
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

      const authoredItems: CatalogComponentItem[] = (
        authoredBoardsByCategory.get(category) ?? []
      ).flatMap((board): CatalogComponentItem[] => {
        const variantRootIds = getBoardVariantRootIds(board)
        const rootId = variantRootIds[0]

        if (!rootId) return []
        const componentName = getVariantById(rootId, workspace).label

        return variantRootIds
          .filter((variantId) => shouldShowAuthored!(variantId))
          .map((variantId) => {
            const variant = getVariantById(variantId, workspace)
            const description = variantId === rootId ? "Component" : variant.label

            return {
              id: variantId,
              componentId: getComponentKey(board) as ComponentId,
              variantId,
              name: componentName,
              icon: getBoardRowIcon(board),
              description,
            }
          })
      })

      const items = [...catalogItems, ...authoredItems].filter((item) => {
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
  }, [shouldShowComponent, shouldShowAuthored, authoredBoardsByCategory, query, workspace])

  return { categories, query, setQuery }
}
