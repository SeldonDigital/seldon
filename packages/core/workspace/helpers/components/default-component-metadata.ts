import type { ComponentId } from "../../../components/constants"
import type { ComponentEntry } from "../../model/components"
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

export function getDefaultComponentLabel(componentKey: string, board: ComponentEntry): string {
  if (isComponentBoard(board)) {
    return workspaceMutationService.getInitialComponentLabel(board.catalogId as ComponentId)
  }
  if ("catalogId" in board && typeof board.catalogId === "string") {
    return board.catalogId
  }
  return componentKey
}

export const DEFAULT_THEME_COMPONENT_AUTHOR = "Seldon Digital"
