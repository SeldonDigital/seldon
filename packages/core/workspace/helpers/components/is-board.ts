import { Board, EntryNode } from "../../types"

/**
 * Tells whether this value is a catalog row or a node entry.
 *
 * Rows in `workspace.components` carry a `variants` array.
 * Rows in `workspace.nodes` do not.
 *
 * @param nodeOrBoard Value that might be a catalog row or a node entry.
 */
export function isBoard(
  nodeOrBoard: EntryNode | Board,
): nodeOrBoard is Board {
  return "variants" in nodeOrBoard
}
