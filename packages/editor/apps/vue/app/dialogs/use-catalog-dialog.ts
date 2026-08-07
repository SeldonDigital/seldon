import { useWorkspace } from "@app/workspace/use-workspace"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { computed, ref } from "vue"

import { catalog } from "@seldon/core/components/catalog"
import { getBoardRowIcon, getComponentIcon } from "@seldon/core/icon-lookup"
import { getBoardVariantRootIds } from "@seldon/core/workspace/helpers/components/get-board-variant-root-ids"
import { getVariantById } from "@seldon/core/workspace/helpers/general/get-variant-by-id"
import { isAuthoredBoard } from "@seldon/core/workspace/model/components"

import type { CatalogDialogCategory, CatalogDialogItem } from "@app/dialogs/types"
import type { ComponentId } from "@seldon/core/components/constants"
import type { ComponentSchema } from "@seldon/core/components/types"
import type { Board, EntryNodeLevel, VariantId } from "@seldon/core/workspace/types"

export type CatalogItem = CatalogDialogItem & {
  componentId: ComponentId
  variantId?: VariantId
}

export type CatalogCategory = CatalogDialogCategory<CatalogItem>

export type CatalogPredicate = (schema: ComponentSchema) => boolean

export type AuthoredPredicate = (variantRootId: VariantId) => boolean

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
 * Builds catalog categories for a component picker plus a reactive search query.
 * Mirrors the React `useDialog`: the caller supplies the visibility predicate
 * (add-board scoping vs. insertion validation), and the predicate reads reactive
 * state so the categories recompute when the workspace or target changes. When
 * `shouldShowAuthored` is supplied, authored component boards join their declared
 * level's category as insertable variant instances.
 */
export function useCatalogDialog(shouldShow: CatalogPredicate, shouldShowAuthored?: AuthoredPredicate) {
  const query = ref("")
  const { workspace } = useWorkspace()

  const authoredBoardsByCategory = computed(() => {
    const byCategory = new Map<string, Board[]>()

    if (!shouldShowAuthored) return byCategory

    for (const board of Object.values(workspace.value.boards)) {
      if (!isAuthoredBoard(board)) continue
      const category = AUTHORED_LEVEL_CATEGORY[board.level as EntryNodeLevel]

      if (!category) continue
      const bucket = byCategory.get(category) ?? []

      bucket.push(board)
      byCategory.set(category, bucket)
    }

    return byCategory
  })

  const categories = computed<CatalogCategory[]>(() => {
    const queryLower = query.value.toLowerCase()

    return categoryConfigs.map(({ category, schemas }) => {
      const catalogItems: CatalogItem[] = schemas
        .filter((schema) => shouldShow(schema))
        .map((schema) => ({
          id: schema.id,
          componentId: schema.id,
          icon: getComponentIcon(schema.id),
          name: schema.name,
          description: "Default",
        }))

      const authoredItems: CatalogItem[] = (
        authoredBoardsByCategory.value.get(category) ?? []
      ).flatMap((board): CatalogItem[] => {
        const variantRootIds = getBoardVariantRootIds(board)
        const rootId = variantRootIds[0]

        if (!rootId) return []
        const componentName = getVariantById(rootId, workspace.value).label

        return variantRootIds
          .filter((variantId) => shouldShowAuthored!(variantId))
          .map((variantId) => {
            const variant = getVariantById(variantId, workspace.value)
            const description = variantId === rootId ? "Component" : variant.label

            return {
              id: variantId,
              componentId: getComponentKey(board) as ComponentId,
              variantId,
              icon: getBoardRowIcon(board),
              name: componentName,
              description,
            }
          })
      })

      const items = [...catalogItems, ...authoredItems].filter((item) => {
        if (queryLower.length === 0) return true

        return (
          item.name.toLowerCase().includes(queryLower) ||
          item.description.toLowerCase().includes(queryLower) ||
          item.variantId?.toLowerCase().includes(queryLower) ||
          item.componentId.toLowerCase().includes(queryLower)
        )
      })

      return { category, items }
    })
  })

  return { categories, query }
}
