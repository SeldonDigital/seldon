"use client"

import { useCallback } from "react"
import { ComponentLevel } from "@seldon/core/components/constants"
import { useAddRemoveCommands } from "@lib/hooks/commands/use-add-remove-commands"
import { useDialog } from "@lib/hooks/use-dialog"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { CatalogPanel } from "./CatalogPanel"
import {
  CatalogComponentItem,
  FilterComponentPredicate,
  useComponentCatalog,
} from "../hooks/use-component-catalog"

const LEVEL_LABELS: Partial<Record<ComponentLevel, string>> = {
  [ComponentLevel.SCREEN]: "screen",
  [ComponentLevel.MODULE]: "module",
  [ComponentLevel.PART]: "part",
  [ComponentLevel.ELEMENT]: "element",
  [ComponentLevel.PRIMITIVE]: "primitive",
  [ComponentLevel.FRAME]: "frame",
}

/**
 * This panel is used to add a board to the workspace. When `level` is provided
 * the catalog is scoped to that component level (e.g. only elements).
 */
export function AddBoardPanel({
  onClose,
  level,
}: {
  onClose: () => void
  level?: ComponentLevel
}) {
  const { workspace } = useWorkspace()
  const { addBoard } = useAddRemoveCommands()
  const { selectBoard } = useSelection()

  const currentBoards = Object.keys(workspace.boards)

  const shouldShowComponent: FilterComponentPredicate = useCallback(
    (schema) => {
      // Board-level schemas are never offered in this panel.
      if (schema.level === ComponentLevel.BOARD) return false

      if (level) {
        // Scoped add: only the requested level (frames included when asked for).
        if (schema.level !== level) return false
      } else if (schema.level === ComponentLevel.FRAME) {
        // Unscoped add: hide frames, matching the global add behavior.
        return false
      }

      return !currentBoards.includes(schema.id)
    },
    [currentBoards, level],
  )

  // Add the board and close the dialog
  const handlePick = async (item: CatalogComponentItem) => {
    await addBoard(item.componentId)
    selectBoard(item.componentId)
  }

  const { categories, query, setQuery, submit, isFetching } =
    useComponentCatalog({
      shouldShowComponent,
      task: "search_catalog",
    })

  const title = level
    ? `Add ${LEVEL_LABELS[level] ?? "component"}`
    : "Add component"

  return (
    <CatalogPanel
      onClose={onClose}
      onPick={handlePick}
      categories={categories}
      query={query}
      onQueryChange={setQuery}
      onSubmitSearch={submit}
      isSearching={isFetching}
      confirmButtonText={title}
      title={title}
    />
  )
}

const Controller = () => {
  const { activeDialog, dialogLevel, closeDialog } = useDialog()

  if (activeDialog !== "add-board") return null

  return <AddBoardPanel onClose={closeDialog} level={dialogLevel} />
}

AddBoardPanel.Controller = Controller
