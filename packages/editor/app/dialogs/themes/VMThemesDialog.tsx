"use client"

import { useCallback, useMemo } from "react"
import { STOCK_THEMES } from "@seldon/core/themes/catalog"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useAddRemoveCommands } from "@lib/hooks/commands/use-add-remove-commands"
import { useDialog } from "@lib/hooks/use-dialog"
import { CatalogDialogItem } from "../types"
import { useStockCatalog } from "../hooks/use-stock-catalog"
import { VMCatalogDialog } from "../VMCatalogDialog"

const THEME_ICON = "seldon-theme"

/**
 * Dialog for adding a stock theme board to the workspace.
 */
export function VMThemesDialog() {
  const { activeDialog, closeDialog } = useDialog()
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

  if (activeDialog !== "add-theme") return null

  return (
    <VMCatalogDialog
      title="Add theme"
      confirmButtonText="Add theme"
      categories={categories}
      query={query}
      onQueryChange={setQuery}
      onPick={handlePick}
      onClose={closeDialog}
    />
  )
}
