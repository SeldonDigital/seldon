import { type Board, isThemeBoard } from "../../../model/components"
import type { Workspace } from "../../../model/workspace"

/**
 * v3: rename stock themes whose catalog id changed.
 *
 * For each rename, this step rewrites every theme entry templated
 * `catalog:{oldId}` to the new template, and renames the theme board row (map
 * key, `catalogId`, and label) so persisted workspaces resolve the renamed
 * stock template instead of throwing on an unknown one.
 *
 * Add future stock theme renames to {@link THEME_RENAMES}.
 */

type ThemeRename = {
  oldCatalogId: string
  newCatalogId: string
  newLabel: string
}

const THEME_RENAMES: ThemeRename[] = [
  { oldCatalogId: "pop", newCatalogId: "popPunk", newLabel: "Pop Punk" },
  {
    oldCatalogId: "royalAzure",
    newCatalogId: "ibmCarbon",
    newLabel: "IBM Carbon",
  },
  {
    oldCatalogId: "sky",
    newCatalogId: "adobeSpectrum",
    newLabel: "Adobe Spectrum",
  },
  {
    oldCatalogId: "material",
    newCatalogId: "googleMaterial",
    newLabel: "Google Material",
  },
]

const RENAME_BY_OLD_TEMPLATE = new Map(
  THEME_RENAMES.map((rename) => [`catalog:${rename.oldCatalogId}`, rename]),
)
const RENAME_BY_OLD_CATALOG_ID = new Map(
  THEME_RENAMES.map((rename) => [rename.oldCatalogId, rename]),
)

function themeBoardRename(board: Board): ThemeRename | undefined {
  if (!isThemeBoard(board)) return undefined
  return RENAME_BY_OLD_CATALOG_ID.get(board.catalogId)
}

/** True when a theme entry or board still references a renamed stock id. */
function migrationApplies(workspace: Workspace): boolean {
  for (const entry of Object.values(workspace.themes)) {
    if (RENAME_BY_OLD_TEMPLATE.has(entry.template)) return true
  }
  for (const board of Object.values(workspace.boards)) {
    if (themeBoardRename(board)) return true
  }
  return false
}

export function migrateV3ThemeRenames(workspace: Workspace): Workspace {
  if (!migrationApplies(workspace)) return workspace

  const next = structuredClone(workspace)

  for (const entry of Object.values(next.themes)) {
    const rename = RENAME_BY_OLD_TEMPLATE.get(entry.template)
    if (rename) {
      entry.template = `catalog:${rename.newCatalogId}`
    }
  }

  const boards = next.boards
  for (const [key, board] of Object.entries(boards)) {
    if (!isThemeBoard(board)) continue
    const rename = RENAME_BY_OLD_CATALOG_ID.get(board.catalogId)
    if (!rename) continue
    board.catalogId = rename.newCatalogId
    board.label = rename.newLabel
    if (key === rename.oldCatalogId && !boards[rename.newCatalogId]) {
      boards[rename.newCatalogId] = board
      delete boards[key]
    }
  }

  return next
}
