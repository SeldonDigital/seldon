"use client"

import { useMemo, useState } from "react"
import { STOCK_ICON_SETS } from "@seldon/core/icon-sets/catalog"
import { DEFAULT_ICON_SET_BOARD_KEY } from "@seldon/core/workspace/helpers/icon-sets/seed-default-icon-set-board"
import { useAddRemoveCommands } from "@lib/hooks/commands/use-add-remove-commands"
import { useDialog } from "@lib/hooks/use-dialog"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { CatalogPanel, CatalogPanelItem } from "./CatalogPanel"

const ICON_SET_ICON = "material-category"

/**
 * Picker for adding a stock icon set board to the workspace. The seeded Seldon
 * icon set is never offered.
 */
export function AddIconSetPanel({ onClose }: { onClose: () => void }) {
  const { workspace } = useWorkspace()
  const { addIconSet } = useAddRemoveCommands()
  const [query, setQuery] = useState("")

  const currentBoards = Object.keys(workspace.components)

  const categories = useMemo(() => {
    const queryLower = query.toLowerCase()
    const items: CatalogPanelItem[] = STOCK_ICON_SETS.filter(
      (set) =>
        set.metadata.id !== DEFAULT_ICON_SET_BOARD_KEY &&
        !currentBoards.includes(set.metadata.id),
    )
      .map((set) => ({
        id: set.metadata.id,
        icon: ICON_SET_ICON,
        name: set.metadata.name,
        description: set.metadata.description,
      }))
      .filter(
        (item) =>
          query.length === 0 ||
          item.name.toLowerCase().includes(queryLower) ||
          item.description.toLowerCase().includes(queryLower),
      )

    return [{ category: "Icon Sets", items }]
  }, [currentBoards, query])

  const handlePick = (item: CatalogPanelItem) => {
    addIconSet(item.id)
  }

  return (
    <CatalogPanel
      onClose={onClose}
      onPick={handlePick}
      categories={categories}
      query={query}
      onQueryChange={setQuery}
      confirmButtonText="Add icon set"
      title="Add icon set"
    />
  )
}

const Controller = () => {
  const { activeDialog, closeDialog } = useDialog()

  if (activeDialog !== "add-icon-set") return null

  return <AddIconSetPanel onClose={closeDialog} />
}

AddIconSetPanel.Controller = Controller
