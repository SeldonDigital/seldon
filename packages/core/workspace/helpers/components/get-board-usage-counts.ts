import { getComponentSchema } from "../../../components/catalog"
import { ComponentLevel, isComponentId } from "../../../components/constants"
import { isAuthoredBoard, isComponentBoard } from "../../model/components"
import type { Board, ComponentTreeRef, Workspace } from "../../types"
import { boardKey, createBoardRefResolver } from "./board-ref-resolver"

function boardLevel(board: Board): ComponentLevel | null {
  if (isComponentBoard(board) && isComponentId(board.catalogId)) {
    return getComponentSchema(board.catalogId).level
  }
  if (isAuthoredBoard(board)) {
    return board.level as ComponentLevel
  }
  return null
}

/**
 * Out-degree per board: how many distinct other boards at the same level a board
 * directly composes. The walk descends through the board's own nodes and through
 * frame containers, then stops at each instance of another board, so components
 * a dependency pulls in transitively are not attributed to this board. Frames
 * are transparent containers and are never counted. Boards whose level is
 * unknown are skipped.
 *
 * Board ordering uses this to sort composite boards, which use many others,
 * above leaf boards, which use few. The objects sidebar and the isolation canvas
 * both read the resulting order.
 */
export function getBoardUsageCounts(
  workspace: Workspace,
  boards: Board[],
): Map<string, number> {
  const { resolveRef } = createBoardRefResolver(workspace, boards)

  const levelByKey = new Map<string, ComponentLevel>()
  for (const board of boards) {
    const key = boardKey(board)
    const level = boardLevel(board)
    if (key && level) levelByKey.set(key, level)
  }

  const counts = new Map<string, number>()

  for (const board of boards) {
    const ownerKey = boardKey(board)
    const ownerLevel = ownerKey ? levelByKey.get(ownerKey) : undefined
    if (!ownerKey || !ownerLevel) continue

    const used = new Set<string>()

    const walk = (ref: ComponentTreeRef): void => {
      const node = workspace.nodes?.[ref.id]
      const dependency = node ? resolveRef(node) : null
      const depKey = dependency?.key ?? null
      const depLevel = depKey ? levelByKey.get(depKey) : undefined

      // The board's own nodes and frame containers are transparent, so descend
      // into them and let their direct children count against this board.
      if (depKey === ownerKey || depLevel === ComponentLevel.FRAME) {
        for (const child of ref.children ?? []) walk(child)
        return
      }

      // An instance of another same-level board is a direct dependency. Stop
      // here so the dependency's own subtree is not attributed to this board.
      if (depKey && depLevel === ownerLevel) used.add(depKey)
    }

    for (const root of board.variants) {
      for (const child of (root as ComponentTreeRef).children ?? []) walk(child)
    }

    counts.set(ownerKey, used.size)
  }

  return counts
}
