import {
  type Board,
  isIconSetBoard,
  isThemeBoard,
} from "../../../model/components"
import type { Workspace } from "../../../model/workspace"

/**
 * v6: rename stock icon sets whose catalog id changed.
 *
 * The `googleMaterial` icon set id collided with the renamed `googleMaterial`
 * theme id, so both boards resolved to the same catalog key and selection
 * matched both at once. This step renames the icon set to `googleSymbols`.
 *
 * For each rename, this step rewrites every icon set entry templated
 * `catalog:{oldId}` to the new template, and renames the icon set board row (map
 * key, `catalogId`, and label). It then repairs the theme board left under a
 * stale map key by the earlier collision, re-keying it to its own `catalogId`
 * once the freed slot allows it.
 *
 * Add future stock icon set renames to {@link ICON_SET_RENAMES}.
 */

type IconSetRename = {
  oldCatalogId: string
  newCatalogId: string
  newLabel: string
}

const ICON_SET_RENAMES: IconSetRename[] = [
  {
    oldCatalogId: "googleMaterial",
    newCatalogId: "googleSymbols",
    newLabel: "Google Symbols",
  },
]

const RENAME_BY_OLD_TEMPLATE = new Map(
  ICON_SET_RENAMES.map((rename) => [`catalog:${rename.oldCatalogId}`, rename]),
)
const RENAME_BY_OLD_CATALOG_ID = new Map(
  ICON_SET_RENAMES.map((rename) => [rename.oldCatalogId, rename]),
)

function iconSetBoardRename(board: Board): IconSetRename | undefined {
  if (!isIconSetBoard(board)) return undefined
  return RENAME_BY_OLD_CATALOG_ID.get(board.catalogId)
}

/**
 * A theme board stranded under a map key that no longer matches its `catalogId`.
 * The earlier collision blocked the theme rename from re-keying it, so once the
 * icon set frees the shared key this repair aligns the board key again.
 */
function themeBoardKeyMismatch(
  key: string,
  board: Board,
  boards: Record<string, Board>,
): boolean {
  return (
    isThemeBoard(board) &&
    key !== board.catalogId &&
    boards[board.catalogId] === undefined
  )
}

/** True when an icon set entry, icon set board, or theme board key needs repair. */
function migrationApplies(workspace: Workspace): boolean {
  for (const entry of Object.values(workspace["icon-sets"])) {
    if (RENAME_BY_OLD_TEMPLATE.has(entry.template)) return true
  }
  for (const [key, board] of Object.entries(workspace.boards)) {
    if (iconSetBoardRename(board)) return true
    if (themeBoardKeyMismatch(key, board, workspace.boards)) return true
  }
  return false
}

export function migrateV6IconSetRenames(workspace: Workspace): Workspace {
  if (!migrationApplies(workspace)) return workspace

  const next = structuredClone(workspace)

  for (const entry of Object.values(next["icon-sets"])) {
    const rename = RENAME_BY_OLD_TEMPLATE.get(entry.template)
    if (rename) {
      entry.template = `catalog:${rename.newCatalogId}`
    }
  }

  const boards = next.boards
  for (const [key, board] of Object.entries(boards)) {
    if (!isIconSetBoard(board)) continue
    const rename = RENAME_BY_OLD_CATALOG_ID.get(board.catalogId)
    if (!rename) continue
    board.catalogId = rename.newCatalogId
    board.label = rename.newLabel
    if (key === rename.oldCatalogId && !boards[rename.newCatalogId]) {
      boards[rename.newCatalogId] = board
      delete boards[key]
    }
  }

  for (const [key, board] of Object.entries(boards)) {
    if (!isThemeBoard(board)) continue
    if (key === board.catalogId) continue
    if (boards[board.catalogId] !== undefined) continue
    boards[board.catalogId] = board
    delete boards[key]
  }

  return next
}
