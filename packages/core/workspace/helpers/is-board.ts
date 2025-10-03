import { Board, Instance, Variant } from "../types"

/**
 * Type guard that checks if a node is a board by looking for the variants property.
 * @param nodeOrBoard - The node or board to check
 * @returns True if the node is a board, false otherwise
 */
export function isBoard(
  nodeOrBoard: Variant | Instance | Board,
): nodeOrBoard is Board {
  return "variants" in nodeOrBoard
}
