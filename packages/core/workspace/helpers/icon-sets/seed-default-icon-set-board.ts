import { STOCK_ICON_SETS_BY_ID } from "../../../icon-sets/catalog"
import type { ComponentCatalogEntry, IconSetBoard } from "../../model/components"
import { isIconSetBoard } from "../../model/components"
import type { EntryIconSet } from "../../model/entry-icon-set"
import { formatIconSetCatalog } from "../../model/template-ref"
import type { Workspace } from "../../model/workspace"
import {
  getComponentOrder,
  setComponentOrder,
} from "../components/component-sort-order"
import { getInitialBoardComponentProperties } from "../components/get-initial-board-component-properties"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../themes/workspace-editable-theme"

/** Catalog row key for the default icon set board (matches the Seldon icon set id). */
export const DEFAULT_ICON_SET_BOARD_KEY = "seldonIcons" as const

/** Icon set entry id for the default board's default variant. */
export const DEFAULT_ICON_SET_ENTRY_ID = "icon-set-seldonIcons-default" as const

type SeedableWorkspace = Pick<Workspace, "components" | "icon-sets">

/** Builds the default icon set entry (the default Seldon variant row). */
export function createDefaultIconSetEntry(): EntryIconSet {
  return {
    id: DEFAULT_ICON_SET_ENTRY_ID,
    type: "default",
    label: "Default",
    template: formatIconSetCatalog(DEFAULT_ICON_SET_BOARD_KEY),
    overrides: {},
  }
}

/**
 * Adds the default Seldon icon set board and its default entry when missing.
 *
 * Idempotent: returns early when an icon set board already exists for the
 * `seldonIcons` set. Mutates the passed workspace in place. The default entry
 * carries no inclusion overrides, so only the set's default categories
 * (user-interface) start on.
 */
export function seedDefaultIconSetBoard(workspace: SeedableWorkspace): void {
  if (!workspace.components) {
    workspace.components = {}
  }
  if (!workspace["icon-sets"]) {
    workspace["icon-sets"] = {}
  }

  const existing = workspace.components[DEFAULT_ICON_SET_BOARD_KEY] as
    | ComponentCatalogEntry
    | undefined
  if (existing && isIconSetBoard(existing)) {
    return
  }

  workspace["icon-sets"][DEFAULT_ICON_SET_ENTRY_ID] = createDefaultIconSetEntry()

  const existingBoards = Object.values(workspace.components)
  const maxOrder =
    existingBoards.length > 0
      ? Math.max(...existingBoards.map((b) => getComponentOrder(b)))
      : -1

  const board: IconSetBoard = {
    type: "icon-set",
    catalogId: DEFAULT_ICON_SET_BOARD_KEY,
    label: STOCK_ICON_SETS_BY_ID[DEFAULT_ICON_SET_BOARD_KEY].metadata.name,
    componentPreview: "seldonIconsPreview",
    componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
    componentProperties: getInitialBoardComponentProperties("icon-set"),
    variants: [{ id: DEFAULT_ICON_SET_ENTRY_ID }],
  }
  setComponentOrder(board, maxOrder + 1)
  workspace.components[DEFAULT_ICON_SET_BOARD_KEY] = board
}
