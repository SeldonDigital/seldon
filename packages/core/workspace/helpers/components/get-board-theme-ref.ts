import type { ThemeInstanceId } from "../../../themes/types"
import type { Board } from "../../types"

/** Reads the theme ref stored on a catalog row (`componentTheme`). */
export function getBoardThemeRef(
  board: Board,
): ThemeInstanceId | undefined {
  if (typeof board.componentTheme === "string" && board.componentTheme.length > 0) {
    return board.componentTheme as ThemeInstanceId
  }
  return undefined
}
