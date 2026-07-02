import type { ThemeBoard } from "../../model/components"
import { DEFAULT_THEME_BOARD_KEY } from "../seed/seed-default-theme-board"

/**
 * Orders theme boards for display: the Seldon base board first, then every other
 * board alphabetically by label. Variants stay grouped under their board by the
 * consumer. Shared by the theme picker menus and the Themes board section so the
 * order stays identical.
 */
function compareThemeBoardsForDisplay(a: ThemeBoard, b: ThemeBoard): number {
  const aSeldon = a.catalogId === DEFAULT_THEME_BOARD_KEY
  const bSeldon = b.catalogId === DEFAULT_THEME_BOARD_KEY
  if (aSeldon !== bSeldon) {
    return aSeldon ? -1 : 1
  }
  return a.label.localeCompare(b.label)
}

/** Returns a new array of theme boards in display order. */
export function sortThemeBoardsForDisplay(boards: ThemeBoard[]): ThemeBoard[] {
  return [...boards].sort(compareThemeBoardsForDisplay)
}
