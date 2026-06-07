import type { ComponentId } from "../../../components/constants"
import type { Board } from "../../model/components"
import { isComponentBoard } from "../../model/components"
import {
  nodeRetrievalService,
  nodeTraversalService,
  nodeRelationshipService,
  nodeOperationsService,
  workspaceMutationService,
  workspaceThemeService,
  workspacePropagationService,
  typeCheckingService,
} from "../../services"

export function getDefaultBoardLabel(boardKey: string, board: Board): string {
  if (isComponentBoard(board)) {
    return workspaceMutationService.getInitialComponentLabel(board.catalogId as ComponentId)
  }
  if ("catalogId" in board && typeof board.catalogId === "string") {
    return board.catalogId
  }
  return boardKey
}

export const DEFAULT_THEME_BOARD_AUTHOR = "Seldon Digital"
