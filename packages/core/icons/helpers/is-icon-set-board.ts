import { ComponentId } from "@seldon/core/components/constants"
import { Board } from "@seldon/core/workspace/types"

export function isIconSetBoard(board: Board): boolean {
  return board.component === ComponentId.ICON_SET
}
