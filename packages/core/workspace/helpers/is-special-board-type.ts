import type { ComponentEntry } from "../types"
import { isResourceType } from "./components/is-resource-type"

/** @deprecated Use `isResourceType` for theme, icon-set, font-collection, and media rows. */
export function isSpecialBoardType(board: ComponentEntry): boolean {
  return isResourceType(board)
}
