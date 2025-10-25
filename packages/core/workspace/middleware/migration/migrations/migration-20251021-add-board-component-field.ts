import { produce } from "immer"
import { ComponentId } from "../../../../components/constants"
import { Workspace } from "../../../types"

/**
 * Migration: Add component field to all existing boards
 *
 * This migration adds the `component: ComponentId.BOARD` field to all existing boards
 * in the workspace to support the new Board schema system.
 *
 * Version: 3
 * Date: 2025-01-27
 */
export function addBoardComponentField(workspace: Workspace): Workspace {
  return produce(workspace, (draft) => {
    // Add component field to all boards
    for (const [boardId, board] of Object.entries(draft.boards)) {
      if (!("component" in board)) {
        // Set component to the board's ID (which is the ComponentId)
        ;(board as any).component = boardId as ComponentId
      }
    }
  })
}
