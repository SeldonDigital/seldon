"use client"

import { useMemo, useState } from "react"
import { STOCK_THEMES } from "@seldon/core/themes/catalog"
import { useAddRemoveCommands } from "@lib/hooks/commands/use-add-remove-commands"
import { useDialog } from "@lib/hooks/use-dialog"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { CatalogPanel, CatalogPanelItem } from "./CatalogPanel"

const THEME_ICON = "material-palette"

/**
 * Picker for adding a stock theme board to the workspace.
 */
export function AddThemePanel({ onClose }: { onClose: () => void }) {
  const { workspace } = useWorkspace()
  const { addTheme } = useAddRemoveCommands()
  const [query, setQuery] = useState("")

  const currentBoards = Object.keys(workspace.components)

  const categories = useMemo(() => {
    const queryLower = query.toLowerCase()
    const items: CatalogPanelItem[] = STOCK_THEMES.filter(
      (theme) => !currentBoards.includes(theme.metadata.id),
    )
      .map((theme) => ({
        id: theme.metadata.id,
        icon: THEME_ICON,
        name: theme.metadata.name,
        description: theme.metadata.description,
      }))
      .filter(
        (item) =>
          query.length === 0 ||
          item.name.toLowerCase().includes(queryLower) ||
          item.description.toLowerCase().includes(queryLower),
      )

    return [{ category: "Themes", items }]
  }, [currentBoards, query])

  const handlePick = (item: CatalogPanelItem) => {
    addTheme(item.id)
  }

  return (
    <CatalogPanel
      onClose={onClose}
      onPick={handlePick}
      categories={categories}
      query={query}
      onQueryChange={setQuery}
      confirmButtonText="Add theme"
      title="Add theme"
    />
  )
}

const Controller = () => {
  const { activeDialog, closeDialog } = useDialog()

  if (activeDialog !== "add-theme") return null

  return <AddThemePanel onClose={closeDialog} />
}

AddThemePanel.Controller = Controller
