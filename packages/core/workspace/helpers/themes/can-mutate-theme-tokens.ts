import { isEntryThemeDefault, isEntryThemeVariant } from "../../model/entry-theme"
import { isAuthoredThemeBoard } from "../components/resource-board-catalog-ids"
import { themeBoardKeyFromEntryId } from "./theme-id"

import type { Workspace } from "../../model/workspace"

/**
 * True when token writes may target this theme entry. Stock catalog defaults
 * stay locked. A user variant may add and edit tokens. An authored theme's
 * default owns its values, so it is writable too.
 */
export function canMutateThemeTokens(workspace: Workspace, themeId: string): boolean {
  const entry = workspace.themes[themeId]

  if (!entry) return false
  if (isEntryThemeVariant(entry)) return true
  if (!isEntryThemeDefault(entry)) return false

  const boardKey = themeBoardKeyFromEntryId(themeId)

  if (!boardKey) return false
  const board = workspace.boards[boardKey]

  return Boolean(board && isAuthoredThemeBoard(board))
}
