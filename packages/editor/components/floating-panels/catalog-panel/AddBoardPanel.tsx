"use client"

import { useCallback } from "react"
import { ComponentLevel } from "@seldon/core/components/constants"
import { useAddRemoveCommands } from "@lib/hooks/commands/use-add-remove-commands"
import { useDialog } from "@lib/hooks/use-dialog"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import {
  CatalogItem,
  CatalogPanel,
  FilterComponentPredicate,
} from "./CatalogPanel"

/**
 * This panel is used to add a boards to the workspace
 */
export function AddBoardPanel({ onClose }: { onClose: () => void }) {
  const { workspace } = useWorkspace()
  const { addBoard } = useAddRemoveCommands()
  const { selectBoard } = useSelection()

  const currentBoards = Object.keys(workspace.boards)

  const shouldShowComponent: FilterComponentPredicate = useCallback(
    (schema) => {
      // Don't show frames in boards panel
      if (schema.level === ComponentLevel.FRAME) return false

      return !currentBoards.includes(schema.id)
    },
    [currentBoards],
  )

  // Add the board and close the dialog
  const handlePick = (item: CatalogItem) => {
    addBoard(item.componentId)
    selectBoard(item.componentId)
  }

  return (
    <CatalogPanel
      onClose={onClose}
      onPick={handlePick}
      shouldShowComponent={shouldShowComponent}
      confirmButtonText="Add component"
      title="Add component"
      task="search_catalog"
    />
  )
}

const Controller = () => {
  const { activeDialog, closeDialog } = useDialog()

  if (activeDialog !== "add-board") return null

  return <AddBoardPanel onClose={closeDialog} />
}

AddBoardPanel.Controller = Controller
