"use client"

import { useCallback, useMemo } from "react"
import { STOCK_THEMES } from "@seldon/core/themes/catalog"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { useAddRemoveCommands } from "@app/hooks/commands/use-add-remove-commands"
import { usePanel } from "@app/hooks/use-panel"
import { useStockCatalog } from "../hooks/use-stock-catalog"
import { PanelDialogController } from "../PanelDialogController"
import { CatalogDialogItem } from "../types"

const THEME_ICON = "seldon-theme"

/**
 * Dialog for adding a stock theme board to the workspace.
 */
export function ThemesDialog() {
  const { activePanel, closePanel } = usePanel()
  const { workspace } = useWorkspace()
  const { addTheme } = useAddRemoveCommands()

  const currentBoards = useMemo(
    () => Object.keys(workspace.boards),
    [workspace],
  )

  const items = useMemo<CatalogDialogItem[]>(
    () =>
      STOCK_THEMES.filter(
        (theme) => !currentBoards.includes(theme.metadata.id),
      ).map((theme) => ({
        id: theme.metadata.id,
        icon: THEME_ICON,
        name: theme.metadata.name,
        description: theme.metadata.description,
      })),
    [currentBoards],
  )

  const { categories, query, setQuery } = useStockCatalog({
    category: "Themes",
    items,
  })

  const handlePick = useCallback(
    (item: CatalogDialogItem) => addTheme(item.id),
    [addTheme],
  )

  if (activePanel !== "add-theme") return null

  return (
    <PanelDialogController
      title="Add theme"
      confirmButtonText="Add theme"
      categories={categories}
      query={query}
      onQueryChange={setQuery}
      onPick={handlePick}
      onClose={closePanel}
    />
  )
}
