import { STOCK_FONT_COLLECTIONS_BY_ID } from "../../../font-collections/catalog"
import { GOOGLE_DEFAULT_ENABLED_FAMILIES } from "../../../font-collections/catalog/google/default-enabled-families"
import type { FontCollectionTemplateId } from "../../../font-collections/types"
import type { Board, FontCollectionBoard } from "../../model/components"
import { isFontCollectionBoard } from "../../model/components"
import type { EntryFontCollection } from "../../model/entry-font-collection"
import { formatFontCollectionCatalog } from "../../model/template-ref"
import { setFamilyVariantPreset } from "../../reducers/handlers/shared/font-collection-variant-selection"
import { setBoardOrder } from "../components/board-sort-order"
import { getInitialBoardComponentProperties } from "../components/get-initial-board-component-properties"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../themes/workspace-editable-theme"
import { type SeedableWorkspace, nextBoardOrder } from "./seedable-workspace"

/** Catalog row key for the default font collection board (matches the `system` collection id). */
export const DEFAULT_FONT_COLLECTION_BOARD_KEY = "system" as const

/** Font collection entry id for the default board's default variant. */
export const DEFAULT_FONT_COLLECTION_ENTRY_ID =
  "font-collection-system-default" as const

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
 * Builds the Google Fonts entry seeded into new workspaces. Mirrors the
 * `add_font_collection` flow: every curated family is enabled as `All`; every
 * other family is left absent, which means `None`.
 */
function createGoogleFontCollectionEntry(): EntryFontCollection {
  const entry: EntryFontCollection = {
    id: "font-collection-googleFonts-default",
    type: "default",
    label: "Default",
    template: formatFontCollectionCatalog("googleFonts"),
    overrides: {},
  }

  const stock = STOCK_FONT_COLLECTIONS_BY_ID["googleFonts"]
  for (const [slot, family] of Object.entries(stock.families)) {
    if (
      family.variants &&
      family.variants.length > 0 &&
      GOOGLE_DEFAULT_ENABLED_FAMILIES.has(family.name)
    ) {
      setFamilyVariantPreset(entry, slot, "all", family.variants)
    }
  }

  return entry
}

/**
 * Adds the default System font collection board plus the extra stock collections
 * (`googleFonts`) when missing.
 *
 * Idempotent per board: skips any font collection board that already exists.
 * Mutates the passed workspace in place. System is the protected base; the
 * extras are deletable like any added stock collection.
 */
export function seedDefaultFontCollectionBoard(
  workspace: SeedableWorkspace,
): void {
  if (!workspace.boards) {
    workspace.boards = {}
  }
  if (!workspace["font-collections"]) {
    workspace["font-collections"] = {}
  }

  seedFontCollectionBoard(
    workspace,
    DEFAULT_FONT_COLLECTION_BOARD_KEY,
    createDefaultFontCollectionEntry(),
  )

  seedFontCollectionBoard(
    workspace,
    "googleFonts",
    createGoogleFontCollectionEntry(),
  )
}

/** Seeds one font collection board and its entry when the board is missing. */
function seedFontCollectionBoard(
  workspace: SeedableWorkspace,
  boardKey: FontCollectionTemplateId,
  entry: EntryFontCollection,
): void {
  const existing = workspace.boards[boardKey] as Board | undefined
  if (existing && isFontCollectionBoard(existing)) {
    return
  }

  workspace["font-collections"][entry.id] = entry

  const board: FontCollectionBoard = {
    type: "font-collection",
    catalogId: boardKey,
    label: STOCK_FONT_COLLECTIONS_BY_ID[boardKey].metadata.name,
    componentPreview: "seldonFontsPreview",
    componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
    componentProperties: getInitialBoardComponentProperties("font-collection"),
    variants: [{ id: entry.id }],
  }
  setBoardOrder(board, nextBoardOrder(workspace.boards))
  workspace.boards[boardKey] = board
}
