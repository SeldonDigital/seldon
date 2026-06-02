import { produce } from "immer"
import { STOCK_FONT_COLLECTIONS_BY_ID } from "../../../../font-collections/collections"
import type { FontCollectionTemplateId } from "../../../../font-collections/types"
import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  getComponentOrder,
  setComponentOrder,
} from "../../../helpers/components/component-sort-order"
import { getInitialBoardComponentProperties } from "../../../helpers/components/get-initial-board-component-properties"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../../../helpers/themes/workspace-editable-theme"
import { formatFontCollectionCatalog } from "../../../model/template-ref"
import { workspacePropagationService } from "../../../services"
import { formatLabelFromCatalogId } from "../shared/format-label-from-catalog-id"

/**
 * Inserts a font collection board and one `font-collections` row: a default row rooted at
 * `catalog:{componentKey}`.
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
    const componentKey = payload.catalogId
    if (draft.components[componentKey]) {
      return draft
    }

    const existingBoards = Object.values(draft.components)
    const maxOrder =
      existingBoards.length > 0
        ? Math.max(...existingBoards.map((b) => getComponentOrder(b)))
        : -1

    const defaultEntryId = `font-collection-${componentKey}-default`

    const stock =
      STOCK_FONT_COLLECTIONS_BY_ID[componentKey as FontCollectionTemplateId]
    const label = stock
      ? stock.metadata.name
      : formatLabelFromCatalogId(componentKey, "Font collection")

    draft["font-collections"][defaultEntryId] = {
      id: defaultEntryId,
      type: "default",
      label: "Default",
      template: formatFontCollectionCatalog(componentKey),
      overrides: {},
    }

    const board = {
      type: "font-collection" as const,
      catalogId: componentKey,
      label,
      componentPreview: "seldonFontsPreview",
      componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
      componentProperties: getInitialBoardComponentProperties("font-collection"),
      variants: [{ id: defaultEntryId }],
    }
    setComponentOrder(board, maxOrder + 1)
    draft.components[componentKey] = board

    const updatedWorkspace =
      workspacePropagationService.realignComponentOrder(draft)
    Object.assign(draft.components, updatedWorkspace.components)
  })
}
