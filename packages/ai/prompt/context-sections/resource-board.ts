import {
  isFontCollectionBoard,
  isIconSetBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import type {
  Board,
  BoardKey,
  FontCollectionBoard,
  IconSetBoard,
  ThemeBoard,
  Workspace,
} from "@seldon/core/workspace/types"

import { section } from "./section"

/** A resource board (theme, font collection, or icon set) and its map key. */
export interface ResourceBoardMatch {
  boardKey: BoardKey
  board: ThemeBoard | FontCollectionBoard | IconSetBoard
}

/** True for a resource board that carries editable variant entries. */
function isResourceBoard(
  board: Board,
): board is ThemeBoard | FontCollectionBoard | IconSetBoard {
  return (
    isThemeBoard(board) || isFontCollectionBoard(board) || isIconSetBoard(board)
  )
}

/**
 * Finds the resource board whose variant entries include the given entry id. A
 * theme, font collection, or icon set entry lives in exactly one board, so the
 * first match wins. Returns undefined when the id is not a resource entry.
 */
export function findResourceBoardForEntry(
  workspace: Workspace,
  entryId: string,
): ResourceBoardMatch | undefined {
  for (const [boardKey, board] of Object.entries(workspace.boards)) {
    if (!isResourceBoard(board)) continue
    if (board.variants.some((ref) => ref.id === entryId)) {
      return { boardKey, board }
    }
  }
  return undefined
}

/**
 * Lists a resource board's variant entries, default first. Resource variant refs
 * carry only an id, so this pairs each id with its position; the default entry is
 * variants[0]. The model targets these ids as themeId, fontCollectionId, or
 * iconSetId.
 */
export function resourceBoardEntriesSection(
  board: ThemeBoard | FontCollectionBoard | IconSetBoard,
  boardKey: BoardKey,
): string[] {
  const body = board.variants.map(
    (ref, index) => `- ${ref.id}${index === 0 ? " (default)" : ""}`,
  )
  return section(
    `Resource board entries: ${boardKey} -> "${board.label}" (target these ids):`,
    body,
  )
}
