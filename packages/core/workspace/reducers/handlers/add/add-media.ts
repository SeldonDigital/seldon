import { produce } from "immer"
import { getInitialBoardComponentProperties } from "../../../helpers/components/get-initial-board-component-properties"
import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  getBoardOrder,
  setBoardOrder,
} from "../../../helpers/components/board-sort-order"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../../../helpers/themes/workspace-editable-theme"
import { workspacePropagationService } from "../../../services"
import { formatLabelFromCatalogId } from "../shared/format-label-from-catalog-id"

/** Creates a media board with default and custom rows in `media`. */
export function addMedia(
  payload: ExtractPayload<"add_media">,
  workspace: Workspace,
): Workspace {
  if (!rules.mutations.create.board.allowed) {
    return workspace
  }

  return produce(workspace, (draft) => {
    if (!draft.media) {
      draft.media = {}
    }
    const boardKey = payload.catalogId
    if (draft.components[boardKey]) {
      return draft
    }

    const existingBoards = Object.values(draft.components)
    const maxOrder =
      existingBoards.length > 0
        ? Math.max(...existingBoards.map((b) => getBoardOrder(b)))
        : -1

    const defaultEntryId = `media-${boardKey}-default`
    const variantEntryId = `media-${boardKey}-custom-${Date.now()}`

    draft.media[defaultEntryId] = { id: defaultEntryId }
    draft.media[variantEntryId] = { id: variantEntryId }

    const board = {
      type: "media" as const,
      catalogId: boardKey,
      label: formatLabelFromCatalogId(boardKey, "Media"),
      componentPreview: "seldonMediaPreview",
      componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
      componentProperties: getInitialBoardComponentProperties("media"),
      variants: [{ id: defaultEntryId }, { id: variantEntryId }],
    }
    setBoardOrder(board, maxOrder + 1)
    draft.components[boardKey] = board

    const updatedWorkspace = workspacePropagationService.realignBoardOrder(draft)
    Object.assign(draft.components, updatedWorkspace.components)
  })
}
