"use client"

import { useMemo, useState } from "react"
import { STOCK_FONT_COLLECTIONS } from "@seldon/core/font-collections/catalog"
import { DEFAULT_FONT_COLLECTION_BOARD_KEY } from "@seldon/core/workspace/helpers/seed/seed-default-font-collection-board"
import { useAddRemoveCommands } from "@lib/hooks/commands/use-add-remove-commands"
import { useDialog } from "@lib/hooks/use-dialog"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { CatalogPanel, CatalogPanelItem } from "./CatalogPanel"

const FONT_COLLECTION_ICON = "material-fontDownload"

/**
 * Picker for adding a stock font collection board to the workspace. The seeded
 * System collection is never offered.
 */
export function AddFontCollectionPanel({ onClose }: { onClose: () => void }) {
  const { workspace } = useWorkspace()
  const { addFontCollection } = useAddRemoveCommands()
  const [query, setQuery] = useState("")

  const currentBoards = Object.keys(workspace.components)

  const categories = useMemo(() => {
    const queryLower = query.toLowerCase()
    const items: CatalogPanelItem[] = STOCK_FONT_COLLECTIONS.filter(
      (collection) =>
        collection.metadata.id !== DEFAULT_FONT_COLLECTION_BOARD_KEY &&
        !currentBoards.includes(collection.metadata.id),
    )
      .map((collection) => ({
        id: collection.metadata.id,
        icon: FONT_COLLECTION_ICON,
        name: collection.metadata.name,
        description: collection.metadata.description,
      }))
      .filter(
        (item) =>
          query.length === 0 ||
          item.name.toLowerCase().includes(queryLower) ||
          item.description.toLowerCase().includes(queryLower),
      )

    return [{ category: "Font Collections", items }]
  }, [currentBoards, query])

  const handlePick = (item: CatalogPanelItem) => {
    addFontCollection(item.id)
  }

  return (
    <CatalogPanel
      onClose={onClose}
      onPick={handlePick}
      categories={categories}
      query={query}
      onQueryChange={setQuery}
      confirmButtonText="Add font collection"
      title="Add font collection"
    />
  )
}

const Controller = () => {
  const { activeDialog, closeDialog } = useDialog()

  if (activeDialog !== "add-font-collection") return null

  return <AddFontCollectionPanel onClose={closeDialog} />
}

AddFontCollectionPanel.Controller = Controller
