import type { ComponentEntry } from "../../types"

/**
 * Reads this board's type field.
 * The value is always component, playground, theme, font-collection, icon-set, or media.
 *
 * @param board ComponentEntry to read.
 */
export function getComponentType(board: ComponentEntry): ComponentEntry["type"] {
  return board.type
}
