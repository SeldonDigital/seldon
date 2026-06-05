import { produce } from "immer"
import { STOCK_ICON_SETS_BY_ID } from "../../../../icon-sets/catalog"
import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  getComponentOrder,
  setComponentOrder,
} from "../../../helpers/components/component-sort-order"
import { ICON_SET_COMPONENT_CATALOG_IDS } from "../../../helpers/components/resource-component-catalog-ids"
import { getInitialBoardComponentProperties } from "../../../helpers/components/get-initial-board-component-properties"
import { DEFAULT_ICON_SET_BOARD_KEY } from "../../../helpers/icon-sets/seed-default-icon-set-board"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../../../helpers/themes/workspace-editable-theme"
import type { EntryIconSet } from "../../../model/entry-icon-set"
import { formatIconSetCatalog } from "../../../model/template-ref"
import { workspacePropagationService } from "../../../services"
import { formatLabelFromCatalogId } from "../shared/format-label-from-catalog-id"

/**
 * Inserts an icon set board and one `icon-sets` row: a default row rooted at
 * `catalog:{componentKey}`.
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
    const componentKey = payload.catalogId
    if (draft.components[componentKey]) {
      return draft
    }
    if (
      componentKey === DEFAULT_ICON_SET_BOARD_KEY ||
      !ICON_SET_COMPONENT_CATALOG_IDS.has(componentKey)
    ) {
      return draft
    }

    const existingBoards = Object.values(draft.components)
    const maxOrder =
      existingBoards.length > 0
        ? Math.max(...existingBoards.map((b) => getComponentOrder(b)))
        : -1

    const defaultEntryId = `icon-set-${componentKey}-default`

    const stock = STOCK_ICON_SETS_BY_ID[componentKey as keyof typeof STOCK_ICON_SETS_BY_ID]
    const label = stock
      ? stock.metadata.name
      : formatLabelFromCatalogId(componentKey, "Icon set")

    const defaultEntry: EntryIconSet = {
      id: defaultEntryId,
      type: "default",
      label: "Default",
      template: formatIconSetCatalog(componentKey),
      overrides: {},
    }

    draft["icon-sets"][defaultEntryId] = defaultEntry

    const board = {
      type: "icon-set" as const,
      catalogId: componentKey,
      label,
      componentPreview: "seldonIconsPreview",
      componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
      componentProperties: getInitialBoardComponentProperties("icon-set"),
      variants: [{ id: defaultEntryId }],
    }
    setComponentOrder(board, maxOrder + 1)
    draft.components[componentKey] = board

    const updatedWorkspace =
      workspacePropagationService.realignComponentOrder(draft)
    Object.assign(draft.components, updatedWorkspace.components)
  })
}
