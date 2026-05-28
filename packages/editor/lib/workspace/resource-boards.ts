import {
  isIconSetBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import type { ComponentEntry, Workspace } from "@seldon/core/workspace/types"
import { getWorkspaceComponentMap } from "./workspace-accessors"

export function findIconSetBoard(workspace: Workspace): ComponentEntry | null {
  for (const board of Object.values(getWorkspaceComponentMap(workspace))) {
    if (isIconSetBoard(board)) {
      return board
    }
  }
  return null
}

export function findThemeBoard(workspace: Workspace): ComponentEntry | null {
  for (const board of Object.values(getWorkspaceComponentMap(workspace))) {
    if (isThemeBoard(board)) {
      return board
    }
  }
  return null
}
