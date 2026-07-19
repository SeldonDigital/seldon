"use client"

import { useCallback, useMemo } from "react"
import { STOCK_ICON_SETS } from "@seldon/core/icon-sets/catalog"
import { DEFAULT_ICON_SET_BOARD_KEY } from "@seldon/core/workspace/helpers/seed/seed-default-icon-set-board"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { useAddRemoveCommands } from "@app/commands/use-add-remove-commands"
import { usePanel } from "@app/editor/hooks/use-panel"
import { useStockCatalog } from "../hooks/use-stock-catalog"
import { PanelDialogController } from "../PanelDialogController"
import { CatalogDialogItem } from "../types"

const ICON_SET_ICON = "material-category"

/**
 * Dialog for adding a stock icon set board to the workspace. The seeded Seldon
 * icon set is never offered.
 */
export function IconSetsDialog() {
  const { activePanel, closePanel } = usePanel()
  const { workspace } = useWorkspace()
  const { addIconSet } = useAddRemoveCommands()

  const currentBoards = useMemo(
    () => Object.keys(workspace.boards),
    [workspace],
  )

  const items = useMemo<CatalogDialogItem[]>(
    () =>
      STOCK_ICON_SETS.filter(
        (set) =>
          set.metadata.id !== DEFAULT_ICON_SET_BOARD_KEY &&
          !currentBoards.includes(set.metadata.id),
      ).map((set) => ({
        id: set.metadata.id,
        icon: ICON_SET_ICON,
        name: set.metadata.name,
        description: set.metadata.description,
      })),
    [currentBoards],
  )

  const { categories, query, setQuery } = useStockCatalog({
    category: "Icon Sets",
    items,
  })

  const handlePick = useCallback(
    (item: CatalogDialogItem) => addIconSet(item.id),
    [addIconSet],
  )

  if (activePanel !== "add-icon-set") return null

  return (
    <PanelDialogController
      title="Add icon set"
      confirmButtonText="Add icon set"
      categories={categories}
      query={query}
      onQueryChange={setQuery}
      onPick={handlePick}
      onClose={closePanel}
    />
  )
}
