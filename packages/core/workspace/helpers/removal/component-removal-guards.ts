import { areBoardVariantsInUse } from "../components/are-board-variants-in-use"
import { getBoardVariantRootIds } from "../components/get-board-variant-root-ids"
import { walkComponentTreeRefs } from "../components/walk-component-tree-refs"
import type { ComponentTreeRef } from "../../model/component-tree"
import {
  isComponentBoard,
  isFontCollectionBoard,
  isMediaBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "../../model/components"
import type { Board, BoardKey, EntryNodeId, Workspace } from "../../types"
import { hasEffectiveThemeReference } from "./effective-theme-references"

/**
 * Collects every node id listed in this board's variant tree refs.
 * Used when deleting non-component boards (e.g. playground) where deletion must not use
 * component-wide node filters.
 */
export function collectSubtreeNodeIdsFromComponentRoots(
  board: Board,
  _workspace: Workspace,
): Set<EntryNodeId> {
  const out = new Set<EntryNodeId>()
  const roots = board.variants as ComponentTreeRef[]

  walkComponentTreeRefs(roots, (ref) => {
    out.add(ref.id)
  })

  return out
}

/**
 * True when any theme-catalog row on this board is still referenced by effective theme.
 */
export function areThemeComponentRootsReferencedByEffectiveTheme(
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
 * (excluding trees owned by `excludeComponentKey`).
 */
export function areCatalogIdsUsedInOtherComponentTrees(
  workspace: Workspace,
  excludeComponentKey: BoardKey,
  candidateIds: ReadonlySet<string>,
): boolean {
  if (candidateIds.size === 0) return false

  for (const [key, other] of Object.entries(workspace.components)) {
    if (key === excludeComponentKey || !other) continue
    let hit = false
    walkComponentTreeRefs(other.variants, (ref) => {
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
export function areResourceComponentRowsUsedInTrees(
  workspace: Workspace,
  boardKey: BoardKey,
  board: Board,
): boolean {
  if (!isFontCollectionBoard(board) && !isMediaBoard(board)) return false
  const ids = new Set(getBoardVariantRootIds(board))
  return areCatalogIdsUsedInOtherComponentTrees(workspace, boardKey, ids)
}

/**
 * Composition + (for theme boards) effective-theme blocking for boards that are actually deletable.
 */
export function shouldBlockDeletableComponentRemoval(
  board: Board,
  workspace: Workspace,
  boardKey: BoardKey,
): boolean {
  if (isComponentBoard(board) || isPlaygroundBoard(board)) {
    if (areBoardVariantsInUse(board, workspace)) return true
    return false
  }

  if (isFontCollectionBoard(board) || isMediaBoard(board)) {
    return areResourceComponentRowsUsedInTrees(workspace, boardKey, board)
  }

  if (isThemeBoard(board)) {
    return areThemeComponentRootsReferencedByEffectiveTheme(board, workspace)
  }

  return false
}
