import {
  isFontCollectionBoard,
  isIconSetBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { getWorkspaceComponentMap } from "./workspace-accessors"

import type { Board, Workspace } from "@seldon/core/workspace/types"

export function findThemeBoard(workspace: Workspace): Board | null {
  for (const board of Object.values(getWorkspaceComponentMap(workspace))) {
    if (isThemeBoard(board)) {
      return board
    }
  }

  return null
}

export function findFontCollectionBoard(workspace: Workspace): Board | null {
  for (const board of Object.values(getWorkspaceComponentMap(workspace))) {
    if (isFontCollectionBoard(board)) {
      return board
    }
  }

  return null
}

export function findIconSetBoard(workspace: Workspace): Board | null {
  for (const board of Object.values(getWorkspaceComponentMap(workspace))) {
    if (isIconSetBoard(board)) {
      return board
    }
  }

  return null
}
