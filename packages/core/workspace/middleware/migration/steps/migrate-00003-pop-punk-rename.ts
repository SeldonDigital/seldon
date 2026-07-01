import { type Board, isThemeBoard } from "../../../model/components"
import type { Workspace } from "../../../model/workspace"

/**
 * v3: rename the stock `pop` theme to `popPunk`.
 *
 * The stock template id changed from `pop` to `popPunk`. This step rewrites
 * every theme entry templated `catalog:pop`, and renames the theme board row
 * (map key, `catalogId`, and label) so persisted workspaces resolve the
 * renamed stock template instead of throwing on an unknown one.
 */

const OLD_TEMPLATE = "catalog:pop"
const NEW_TEMPLATE = "catalog:popPunk"
const OLD_CATALOG_ID = "pop"
const NEW_CATALOG_ID = "popPunk"
const NEW_LABEL = "Pop Punk"

function isPopThemeBoard(board: Board): boolean {
  return isThemeBoard(board) && board.catalogId === OLD_CATALOG_ID
}

/** True when a theme entry or board still references the old `pop` id. */
function migrationApplies(workspace: Workspace): boolean {
  for (const entry of Object.values(workspace.themes)) {
    if (entry.template === OLD_TEMPLATE) return true
  }
  for (const board of Object.values(workspace.boards)) {
    if (isPopThemeBoard(board)) return true
  }
  return false
}

export function migrateV3PopPunkRename(workspace: Workspace): Workspace {
  if (!migrationApplies(workspace)) return workspace

  const next = structuredClone(workspace)

  for (const entry of Object.values(next.themes)) {
    if (entry.template === OLD_TEMPLATE) {
      entry.template = NEW_TEMPLATE
    }
  }

  const boards = next.boards
  for (const [key, board] of Object.entries(boards)) {
    if (!isThemeBoard(board) || board.catalogId !== OLD_CATALOG_ID) continue
    board.catalogId = NEW_CATALOG_ID
    board.label = NEW_LABEL
    if (key === OLD_CATALOG_ID && !boards[NEW_CATALOG_ID]) {
      boards[NEW_CATALOG_ID] = board
      delete boards[key]
    }
  }

  return next
}
