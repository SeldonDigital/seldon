import { produce } from "immer"

import { STOCK_FONT_COLLECTIONS_BY_ID } from "../../../../font-collections/catalog"
import { GOOGLE_DEFAULT_ENABLED_FAMILIES } from "../../../../font-collections/catalog/google/default-enabled-families"
import type { FontCollectionTemplateId } from "../../../../font-collections/types"
import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  getBoardOrder,
  setBoardOrder,
} from "../../../helpers/components/board-sort-order"
import { getInitialBoardComponentProperties } from "../../../helpers/components/get-initial-board-component-properties"
import { FONT_COLLECTION_BOARD_CATALOG_IDS } from "../../../helpers/components/resource-board-catalog-ids"
import { formatEntryId } from "../../../helpers/general/entry-id"
import { DEFAULT_FONT_COLLECTION_BOARD_KEY } from "../../../helpers/seed/seed-default-font-collection-board"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../../../helpers/themes/workspace-editable-theme"
import type { EntryFontCollection } from "../../../model/entry-font-collection"
import { formatFontCollectionCatalog } from "../../../model/template-ref"
import { boardOrderService } from "../../../services"
import { setFamilyVariantPreset } from "../shared/font-collection-variant-selection"
import { formatLabelFromCatalogId } from "../shared/format-label-from-catalog-id"

/**
 * Inserts a font collection board and one `font-collections` row: a default row rooted at
 * `catalog:{boardKey}`.
 *
 * Returns the incoming workspace when creation is blocked by rules or when the board key already exists.
 */
export function addFontCollection(
  payload: ExtractPayload<"add_font_collection">,
  workspace: Workspace,
): Workspace {
  if (!rules.mutations.create.board.allowed) {
    return workspace
  }

  return produce(workspace, (draft) => {
    if (!draft["font-collections"]) {
      draft["font-collections"] = {}
    }
    const boardKey = payload.catalogId
    if (draft.boards[boardKey]) {
      return draft
    }
    // System is the seeded, non-deletable base collection and is never added.
    // Only packaged stock collections (currently just Google) can be added.
    if (
      boardKey === DEFAULT_FONT_COLLECTION_BOARD_KEY ||
      !FONT_COLLECTION_BOARD_CATALOG_IDS.has(boardKey)
    ) {
      return draft
    }

    const existingBoards = Object.values(draft.boards)
    const maxOrder =
      existingBoards.length > 0
        ? Math.max(...existingBoards.map((b) => getBoardOrder(b)))
        : -1

    const defaultEntryId = formatEntryId("font-collection", boardKey, "default")

    const stock =
      STOCK_FONT_COLLECTIONS_BY_ID[boardKey as FontCollectionTemplateId]
    const label = stock
      ? stock.metadata.name
      : formatLabelFromCatalogId(boardKey, "Font collection")

    const defaultEntry: EntryFontCollection = {
      id: defaultEntryId,
      type: "default",
      label: "Default",
      template: formatFontCollectionCatalog(boardKey),
      overrides: {},
    }

    // Adding the Google collection enables only a curated set of families. Each
    // curated family is written as an explicit `All`; every other family is
    // left absent, which means `None`.
    if (stock && stock.metadata.id === "googleFonts") {
      for (const [slot, family] of Object.entries(stock.families)) {
        if (
          family.variants &&
          family.variants.length > 0 &&
          GOOGLE_DEFAULT_ENABLED_FAMILIES.has(family.name)
        ) {
          setFamilyVariantPreset(defaultEntry, slot, "all", family.variants)
        }
      }
    }

    draft["font-collections"][defaultEntryId] = defaultEntry

    const board = {
      type: "font-collection" as const,
      catalogId: boardKey,
      label,
      componentPreview: "seldonFontsPreview",
      componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
      componentProperties:
        getInitialBoardComponentProperties("font-collection"),
      variants: [{ id: defaultEntryId }],
    }
    setBoardOrder(board, maxOrder + 1)
    draft.boards[boardKey] = board

    const updatedWorkspace = boardOrderService.realignBoardOrder(draft)
    Object.assign(draft.boards, updatedWorkspace.boards)
  })
}
