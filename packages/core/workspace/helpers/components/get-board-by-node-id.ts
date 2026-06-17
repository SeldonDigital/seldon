import { isDraft } from "immer"

import { getCompositionContainers } from "../general/get-composition-containers"
import type { Board, EntryNodeId, Workspace } from "../../types"
import { walkBoardTreeRefs } from "./walk-board-tree-refs"

/**
 * Maps every node id in a workspace to the container (board or playground) whose
 * variant tree lists it. Keyed on the `workspace` reference. Reducers build a new
 * workspace reference through Immer when any tree changes, so reads on an
 * unchanged workspace reuse the cached index. Drafts bypass the cache (see below).
 */
const nodeToBoardCache = new WeakMap<object, Map<string, Board>>()

function buildNodeToBoardIndex(workspace: Workspace): Map<string, Board> {
  const index = new Map<string, Board>()
  for (const board of getCompositionContainers(workspace)) {
    walkBoardTreeRefs(board.variants, (ref) => {
      // Keep the first board that lists the id to match scan order.
      if (!index.has(ref.id)) {
        index.set(ref.id, board)
      }
    })
  }
  return index
}

function scanBoardByNodeId(
  workspace: Workspace,
  nodeId: EntryNodeId,
): Board | null {
  for (const board of getCompositionContainers(workspace)) {
    let found = false
    walkBoardTreeRefs(board.variants, (ref) => {
      if (ref.id !== nodeId) return
      found = true
      return true
    })
    if (found) return board
  }
  return null
}

/**
 * Gets the container (board or playground) whose variant tree lists this node id.
 *
 * Returns null when no variant tree contains that id.
 *
 * @param workspace Workspace to search.
 * @param nodeId Node id to find.
 */
export function getBoardByNodeId(
  workspace: Workspace,
  nodeId: EntryNodeId,
): Board | null {
  // Immer drafts mutate in place while keeping a stable proxy identity, so a
  // cached index would go stale during a reducer pass. Scan directly instead.
  if (isDraft(workspace) || isDraft(workspace.boards)) {
    return scanBoardByNodeId(workspace, nodeId)
  }

  let index = nodeToBoardCache.get(workspace)
  if (!index) {
    index = buildNodeToBoardIndex(workspace)
    nodeToBoardCache.set(workspace, index)
  }

  return index.get(nodeId) ?? null
}
