import { areBoardVariantsInUse } from "../components/are-board-variants-in-use"
import { getBoardVariantRootIds } from "../components/get-board-variant-root-ids"
import { walkBoardTreeRefs } from "../components/walk-board-tree-refs"
import {
  isComponentBoard,
  isFontCollectionBoard,
  isMediaBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "../../model/components"
import type { Board, BoardKey, Workspace } from "../../types"
import { hasEffectiveThemeReference } from "./effective-theme-references"

/**
 * True when any theme-catalog row on this board is still referenced by effective theme.
 */
export function areThemeBoardRootsReferencedByEffectiveTheme(
  board: Board,
  workspace: Workspace,
): boolean {
  if (!isThemeBoard(board)) return false
  for (const rootId of getBoardVariantRootIds(board)) {
    if (workspace.themes[rootId] && hasEffectiveThemeReference(workspace, rootId)) {
      return true
    }
  }
  return false
}

/**
 * True when any id in `candidateIds` appears as a ref id under another board's variant tree
 * (excluding trees owned by `excludeBoardKey`).
 */
export function areCatalogIdsUsedInOtherBoardTrees(
  workspace: Workspace,
  excludeBoardKey: BoardKey,
  candidateIds: ReadonlySet<string>,
): boolean {
  if (candidateIds.size === 0) return false

  for (const [key, other] of Object.entries(workspace.components)) {
    if (key === excludeBoardKey || !other) continue
    let hit = false
    walkBoardTreeRefs(other.variants, (ref) => {
      if (candidateIds.has(ref.id)) {
        hit = true
        return true
      }
    })
    if (hit) return true
  }
  return false
}

/**
 * Font / media catalog rows: true when another board's composition tree references a row id.
 */
export function areResourceBoardRowsUsedInTrees(
  workspace: Workspace,
  boardKey: BoardKey,
  board: Board,
): boolean {
  if (!isFontCollectionBoard(board) && !isMediaBoard(board)) return false
  const ids = new Set(getBoardVariantRootIds(board))
  return areCatalogIdsUsedInOtherBoardTrees(workspace, boardKey, ids)
}

/**
 * Composition + (for theme boards) effective-theme blocking for boards that are actually deletable.
 */
export function shouldBlockDeletableBoardRemoval(
  board: Board,
  workspace: Workspace,
  boardKey: BoardKey,
): boolean {
  if (isComponentBoard(board) || isPlaygroundBoard(board)) {
    if (areBoardVariantsInUse(board, workspace)) return true
    return false
  }

  if (isFontCollectionBoard(board) || isMediaBoard(board)) {
    return areResourceBoardRowsUsedInTrees(workspace, boardKey, board)
  }

  if (isThemeBoard(board)) {
    return areThemeBoardRootsReferencedByEffectiveTheme(board, workspace)
  }

  return false
}
