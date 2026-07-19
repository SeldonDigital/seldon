"use client"

import { useCallback, useMemo } from "react"
import { STOCK_FONT_COLLECTIONS } from "@seldon/core/font-collections/catalog"
import { DEFAULT_FONT_COLLECTION_BOARD_KEY } from "@seldon/core/workspace/helpers/seed/seed-default-font-collection-board"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { useAddRemoveCommands } from "@app/hooks/commands/use-add-remove-commands"
import { usePanel } from "@app/hooks/use-panel"
import { useStockCatalog } from "../hooks/use-stock-catalog"
import { PanelDialogController } from "../PanelDialogController"
import { CatalogDialogItem } from "../types"

const FONT_COLLECTION_ICON = "material-fontDownload"

/**
 * Dialog for adding a stock font collection board to the workspace. The seeded
 * System collection is never offered.
 */
export function FontCollectionsDialog() {
  const { activePanel, closePanel } = usePanel()
  const { workspace } = useWorkspace()
  const { addFontCollection } = useAddRemoveCommands()

  const currentBoards = useMemo(
    () => Object.keys(workspace.boards),
    [workspace],
  )

  const items = useMemo<CatalogDialogItem[]>(
    () =>
      STOCK_FONT_COLLECTIONS.filter(
        (collection) =>
          collection.metadata.id !== DEFAULT_FONT_COLLECTION_BOARD_KEY &&
          !currentBoards.includes(collection.metadata.id),
      ).map((collection) => ({
        id: collection.metadata.id,
        icon: FONT_COLLECTION_ICON,
        name: collection.metadata.name,
        description: collection.metadata.description,
      })),
    [currentBoards],
  )

  const { categories, query, setQuery } = useStockCatalog({
    category: "Font Collections",
    items,
  })

  const handlePick = useCallback(
    (item: CatalogDialogItem) => addFontCollection(item.id),
    [addFontCollection],
  )

  if (activePanel !== "add-font-collection") return null

  return (
    <PanelDialogController
      title="Add font collection"
      confirmButtonText="Add font collection"
      categories={categories}
      query={query}
      onQueryChange={setQuery}
      onPick={handlePick}
      onClose={closePanel}
    />
  )
}
