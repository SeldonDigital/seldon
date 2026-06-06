import { STOCK_THEMES_BY_ID } from "../../../themes/catalog"
import type { ThemeTemplateId } from "../../../themes/types/theme-id"
import type { ComponentCatalogEntry, ThemeBoard } from "../../model/components"
import { isThemeBoard } from "../../model/components"
import type { EntryTheme } from "../../model/entry-theme"
import { formatThemeCatalog } from "../../model/template-ref"
import type { Workspace } from "../../model/workspace"
import {
  getComponentOrder,
  setComponentOrder,
} from "../components/component-sort-order"
import { getInitialBoardComponentProperties } from "../components/get-initial-board-component-properties"

/** Catalog row key for the default theme board (matches the `default` stock template id). */
export const DEFAULT_THEME_BOARD_KEY = "seldon" as const

/** Theme entry id for the default board's default variant. This is the editable workspace theme. */
export const DEFAULT_THEME_ENTRY_ID = "theme-seldon-default" as const

/** Extra theme boards seeded into every new workspace alongside the Seldon default. Deletable. */
export const ADDITIONAL_THEME_BOARD_KEYS = [
  "highContrast",
  "material",
] as const satisfies ThemeTemplateId[]

type SeedableWorkspace = Pick<Workspace, "components" | "themes">

/** Builds the default theme entry (the editable workspace theme row). */
export function createDefaultThemeEntry(): EntryTheme {
  return {
    id: DEFAULT_THEME_ENTRY_ID,
    type: "default",
    label: "Seldon",
    template: formatThemeCatalog(DEFAULT_THEME_BOARD_KEY),
    overrides: {},
  }
}

/**
 * Adds the default Seldon theme board plus the extra stock theme boards
 * (`highContrast`, `material`) when missing.
 *
 * Idempotent per board: skips any theme board that already exists. Mutates the
 * passed workspace in place. The Seldon board is the protected base; the extras
 * are deletable like any added stock theme.
 */
export function seedDefaultThemeBoard(workspace: SeedableWorkspace): void {
  if (!workspace.components) {
    workspace.components = {}
  }
  if (!workspace.themes) {
    workspace.themes = {}
  }

  seedThemeBoard(workspace, DEFAULT_THEME_BOARD_KEY, createDefaultThemeEntry())

  for (const boardKey of ADDITIONAL_THEME_BOARD_KEYS) {
    seedThemeBoard(workspace, boardKey, {
      id: `theme-${boardKey}-default`,
      type: "default",
      label: "Default",
      template: formatThemeCatalog(boardKey),
      overrides: {},
    })
  }
}

/**
 * Seeds one theme board and its theme entry when the board is missing. Every
 * board points its editable theme at the Seldon default entry.
 */
function seedThemeBoard(
  workspace: SeedableWorkspace,
  boardKey: ThemeTemplateId,
  entry: EntryTheme,
): void {
  const existing = workspace.components[boardKey] as
    | ComponentCatalogEntry
    | undefined
  if (existing && isThemeBoard(existing)) {
    return
  }

  workspace.themes[entry.id] = entry

  const existingBoards = Object.values(workspace.components)
  const maxOrder =
    existingBoards.length > 0
      ? Math.max(...existingBoards.map((b) => getComponentOrder(b)))
      : -1

  const board: ThemeBoard = {
    type: "theme",
    catalogId: boardKey,
    label: STOCK_THEMES_BY_ID[boardKey].metadata.name,
    author: "Seldon Digital",
    componentPreview: "seldonThemePreview",
    componentTheme: DEFAULT_THEME_ENTRY_ID,
    componentProperties: getInitialBoardComponentProperties("theme"),
    variants: [{ id: entry.id }],
  }
  setComponentOrder(board, maxOrder + 1)
  workspace.components[boardKey] = board
}
