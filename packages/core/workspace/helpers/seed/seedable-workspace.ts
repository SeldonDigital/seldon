import type { Workspace } from "../../model/workspace"
import { getBoardOrder } from "../components/board-sort-order"

/** Workspace slice the board seeders read and mutate. */
export type SeedableWorkspace = Pick<
  Workspace,
  "boards" | "themes" | "font-collections" | "icon-sets"
>

/** Next sort order that places a board after every current board. */
export function nextBoardOrder(boards: Workspace["boards"]): number {
  const boardList = Object.values(boards)
  if (boardList.length === 0) {
    return 0
  }
  return Math.max(...boardList.map((board) => getBoardOrder(board))) + 1
}
