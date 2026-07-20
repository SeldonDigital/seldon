"use client"

import { useAddRemoveCommands } from "@app/commands/use-add-remove-commands"
import { usePanel } from "@app/editor/hooks/use-panel"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { useCallback, useMemo } from "react"

import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"

import { PanelDialogController } from "../PanelDialogController"
import {
  CatalogComponentItem,
  FilterComponentPredicate,
  useDialog,
} from "../hooks/use-dialog"

const LEVEL_LABELS: Partial<Record<ComponentLevel, string>> = {
  [ComponentLevel.SCREEN]: "screen",
  [ComponentLevel.MODULE]: "module",
  [ComponentLevel.PART]: "part",
  [ComponentLevel.ELEMENT]: "element",
  [ComponentLevel.PRIMITIVE]: "primitive",
  [ComponentLevel.FRAME]: "frame",
}

/**
 * Dialog for adding a board to the workspace. When a level is provided the
 * catalog is scoped to that component level (e.g. only elements).
 */
export function BoardsDialog() {
  const { activePanel, dialogLevel, closePanel } = usePanel()
  const { workspace } = useWorkspace()
  const { addBoard } = useAddRemoveCommands()
  const { selectBoard } = useSelection()

  const currentBoards = useMemo(
    () => Object.keys(workspace.boards),
    [workspace],
  )

  const shouldShowComponent = useCallback<FilterComponentPredicate>(
    (schema) => {
      // Board-level schemas are never offered in this panel.
      if (schema.level === ComponentLevel.BOARD) return false

      // Sandbox is a playground-only frame and is never added as a board.
      if (schema.id === ComponentId.SANDBOX) return false

      if (dialogLevel) {
        // Scoped add: only the requested level (frames included when asked for).
        if (schema.level !== dialogLevel) return false
      } else if (schema.level === ComponentLevel.FRAME) {
        // Unscoped add: hide frames, matching the global add behavior.
        return false
      }

      return !currentBoards.includes(schema.id)
    },
    [currentBoards, dialogLevel],
  )

  const { categories, query, setQuery } = useDialog({
    shouldShowComponent,
  })

  const handlePick = useCallback(
    async (item: CatalogComponentItem) => {
      await addBoard(item.componentId)
      selectBoard(item.componentId)
    },
    [addBoard, selectBoard],
  )

  const title = dialogLevel
    ? `Add ${LEVEL_LABELS[dialogLevel] ?? "component"}`
    : "Add component"

  if (activePanel !== "add-board") return null

  return (
    <PanelDialogController
      title={title}
      confirmButtonText={title}
      categories={categories}
      query={query}
      onQueryChange={setQuery}
      onPick={handlePick}
      onClose={closePanel}
    />
  )
}
