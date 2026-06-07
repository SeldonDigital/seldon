import type { Board, EntryNodeId } from "../../types"
import { getChildrenIds } from "./get-children-ids"

/**
 * Direct child node ids for this parent inside the board variant tree.
 *
 * @deprecated Prefer {@link getChildrenIds}; kept for existing import paths.
 */
export function getComponentTreeChildIds(
  board: Board,
  parentId: EntryNodeId,
): EntryNodeId[] {
  return getChildrenIds(board, parentId)
}
