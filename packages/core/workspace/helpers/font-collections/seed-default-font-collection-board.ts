import { STOCK_FONT_COLLECTIONS_BY_ID } from "../../../font-collections/collections"
import type {
  ComponentCatalogEntry,
  FontCollectionBoard,
} from "../../model/components"
import { isFontCollectionBoard } from "../../model/components"
import type { EntryFontCollection } from "../../model/entry-font-collection"
import { formatFontCollectionCatalog } from "../../model/template-ref"
import type { Workspace } from "../../model/workspace"
import {
  getComponentOrder,
  setComponentOrder,
} from "../components/component-sort-order"
import { getInitialBoardComponentProperties } from "../components/get-initial-board-component-properties"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../themes/workspace-editable-theme"

/** Catalog row key for the default font collection board (matches the `system` collection id). */
export const DEFAULT_FONT_COLLECTION_BOARD_KEY = "system" as const

/** Font collection entry id for the default board's default variant. */
export const DEFAULT_FONT_COLLECTION_ENTRY_ID =
  "font-collection-system-default" as const

type SeedableWorkspace = Pick<Workspace, "components" | "font-collections">

/** Builds the default font collection entry (the default System variant row). */
export function createDefaultFontCollectionEntry(): EntryFontCollection {
  return {
    id: DEFAULT_FONT_COLLECTION_ENTRY_ID,
    type: "default",
    label: "Default",
    template: formatFontCollectionCatalog(DEFAULT_FONT_COLLECTION_BOARD_KEY),
    overrides: {},
  }
}

/**
 * Adds the default System font collection board and its default entry when missing.
 *
 * Idempotent: returns early when a font collection board already exists for the `system`
 * collection. Mutates the passed workspace in place.
 */
export function seedDefaultFontCollectionBoard(
  workspace: SeedableWorkspace,
): void {
  if (!workspace.components) {
    workspace.components = {}
  }
  if (!workspace["font-collections"]) {
    workspace["font-collections"] = {}
  }

  const existing = workspace.components[DEFAULT_FONT_COLLECTION_BOARD_KEY] as
    | ComponentCatalogEntry
    | undefined
  if (existing && isFontCollectionBoard(existing)) {
    return
  }

  workspace["font-collections"][DEFAULT_FONT_COLLECTION_ENTRY_ID] =
    createDefaultFontCollectionEntry()

  const existingBoards = Object.values(workspace.components)
  const maxOrder =
    existingBoards.length > 0
      ? Math.max(...existingBoards.map((b) => getComponentOrder(b)))
      : -1

  const board: FontCollectionBoard = {
    type: "font-collection",
    catalogId: DEFAULT_FONT_COLLECTION_BOARD_KEY,
    label: STOCK_FONT_COLLECTIONS_BY_ID[DEFAULT_FONT_COLLECTION_BOARD_KEY]
      .metadata.name,
    componentPreview: "seldonFontsPreview",
    componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
    componentProperties: getInitialBoardComponentProperties("font-collection"),
    variants: [{ id: DEFAULT_FONT_COLLECTION_ENTRY_ID }],
  }
  setComponentOrder(board, maxOrder + 1)
  workspace.components[DEFAULT_FONT_COLLECTION_BOARD_KEY] = board
}
