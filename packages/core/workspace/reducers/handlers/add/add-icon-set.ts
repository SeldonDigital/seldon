import { produce } from "immer"
import { STOCK_ICON_SETS_BY_ID } from "../../../../icon-sets/catalog"
import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  getBoardOrder,
  setBoardOrder,
} from "../../../helpers/components/board-sort-order"
import { ICON_SET_BOARD_CATALOG_IDS } from "../../../helpers/components/resource-board-catalog-ids"
import { getInitialBoardComponentProperties } from "../../../helpers/components/get-initial-board-component-properties"
import { DEFAULT_ICON_SET_BOARD_KEY } from "../../../helpers/seed/seed-default-icon-set-board"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../../../helpers/themes/workspace-editable-theme"
import type { EntryIconSet } from "../../../model/entry-icon-set"
import { formatIconSetCatalog } from "../../../model/template-ref"
import { workspacePropagationService } from "../../../services"
import { formatLabelFromCatalogId } from "../shared/format-label-from-catalog-id"

/**
 * Inserts an icon set board and one `icon-sets` row: a default row rooted at
 * `catalog:{boardKey}`.
 *
 * Returns the incoming workspace when creation is blocked by rules or when the
 * board key already exists. Seldon is the seeded base set and is never added here.
 */
export function addIconSet(
  payload: ExtractPayload<"add_icon_set">,
  workspace: Workspace,
): Workspace {
  if (!rules.mutations.create.board.allowed) {
    return workspace
  }

  return produce(workspace, (draft) => {
    if (!draft["icon-sets"]) {
      draft["icon-sets"] = {}
    }
    const boardKey = payload.catalogId
    if (draft.components[boardKey]) {
      return draft
    }
    if (
      boardKey === DEFAULT_ICON_SET_BOARD_KEY ||
      !ICON_SET_BOARD_CATALOG_IDS.has(boardKey)
    ) {
      return draft
    }

    const existingBoards = Object.values(draft.components)
    const maxOrder =
      existingBoards.length > 0
        ? Math.max(...existingBoards.map((b) => getBoardOrder(b)))
        : -1

    const defaultEntryId = `icon-set-${boardKey}-default`

    const stock = STOCK_ICON_SETS_BY_ID[boardKey as keyof typeof STOCK_ICON_SETS_BY_ID]
    const label = stock
      ? stock.metadata.name
      : formatLabelFromCatalogId(boardKey, "Icon set")

    const defaultEntry: EntryIconSet = {
      id: defaultEntryId,
      type: "default",
      label: "Default",
      template: formatIconSetCatalog(boardKey),
      overrides: {},
    }

    draft["icon-sets"][defaultEntryId] = defaultEntry

    const board = {
      type: "icon-set" as const,
      catalogId: boardKey,
      label,
      componentPreview: "seldonIconsPreview",
      componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
      componentProperties: getInitialBoardComponentProperties("icon-set"),
      variants: [{ id: defaultEntryId }],
    }
    setBoardOrder(board, maxOrder + 1)
    draft.components[boardKey] = board

    const updatedWorkspace =
      workspacePropagationService.realignBoardOrder(draft)
    Object.assign(draft.components, updatedWorkspace.components)
  })
}
