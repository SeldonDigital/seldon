import { STOCK_THEMES_BY_ID } from "../../../themes/stock"
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
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "./workspace-editable-theme"

/** Catalog row key for the default theme board (matches the `default` stock template id). */
export const DEFAULT_THEME_BOARD_KEY = "default" as const

/** Theme entry id for the default board's default variant. */
export const DEFAULT_THEME_ENTRY_ID = "theme-default-default" as const

type SeedableWorkspace = Pick<Workspace, "components" | "themes">

/**
 * Adds the default theme board and its default theme entry when missing.
 *
 * Idempotent: returns early when a theme board already exists for the `default`
 * stock template. Mutates the passed workspace in place, matching
 * `ensureWorkspaceEditableThemeEntry`.
 */
export function seedDefaultThemeBoard(workspace: SeedableWorkspace): void {
  if (!workspace.components) {
    workspace.components = {}
  }
  if (!workspace.themes) {
    workspace.themes = {}
  }

  const existing = workspace.components[DEFAULT_THEME_BOARD_KEY] as
    | ComponentCatalogEntry
    | undefined
  if (existing && isThemeBoard(existing)) {
    return
  }

  const defaultEntry: EntryTheme = {
    id: DEFAULT_THEME_ENTRY_ID,
    type: "default",
    label: "Default",
    template: formatThemeCatalog(DEFAULT_THEME_BOARD_KEY),
    overrides: {},
  }
  workspace.themes[DEFAULT_THEME_ENTRY_ID] = defaultEntry

  const existingBoards = Object.values(workspace.components)
  const maxOrder =
    existingBoards.length > 0
      ? Math.max(...existingBoards.map((b) => getComponentOrder(b)))
      : -1

  const board: ThemeBoard = {
    type: "theme",
    catalogId: DEFAULT_THEME_BOARD_KEY,
    label: STOCK_THEMES_BY_ID[DEFAULT_THEME_BOARD_KEY].metadata.name,
    author: "Seldon Digital",
    componentPreview: "seldonThemePreview",
    componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
    componentProperties: getInitialBoardComponentProperties("theme"),
    variants: [{ id: DEFAULT_THEME_ENTRY_ID }],
  }
  setComponentOrder(board, maxOrder + 1)
  workspace.components[DEFAULT_THEME_BOARD_KEY] = board
}
