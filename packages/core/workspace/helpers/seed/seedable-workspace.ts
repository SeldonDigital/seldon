import type { Workspace } from "../../model/workspace"
import { getBoardOrder } from "../components/board-sort-order"

/** Workspace slice the board seeders read and mutate. */
export type SeedableWorkspace = Pick<
  Workspace,
  "components" | "themes" | "font-collections" | "icon-sets"
>

/** Next sort order that places a board after every current board. */
export function nextBoardOrder(components: Workspace["components"]): number {
  const boards = Object.values(components)
  if (boards.length === 0) {
    return 0
  }
  return Math.max(...boards.map((board) => getBoardOrder(board))) + 1
}
