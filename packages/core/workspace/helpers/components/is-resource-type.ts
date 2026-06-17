import type { Board } from "../../model/components"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isThemeBoard,
} from "../../model/components"

/** True for theme, font-collection, icon-set, or media catalog rows. */
export function isResourceType(board: Board): boolean {
  return (
    isThemeBoard(board) ||
    isIconSetBoard(board) ||
    isMediaBoard(board) ||
    isFontCollectionBoard(board)
  )
}
