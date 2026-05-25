import { produce } from "immer"
import { getInitialBoardComponentProperties } from "../../../helpers/components/get-initial-board-component-properties"
import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  getComponentOrder,
  setComponentOrder,
} from "../../../helpers/components/component-sort-order"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../../../helpers/themes/workspace-editable-theme"
import {
  nodeRetrievalService,
  nodeTraversalService,
  nodeRelationshipService,
  nodeOperationsService,
  workspaceMutationService,
  workspaceThemeService,
  workspacePropagationService,
  typeCheckingService,
} from "../../../services"
import type { ValidationOptions } from "../../helpers/validation"
import { formatLabelFromCatalogId } from "../shared/format-label-from-catalog-id"

/**
 * Creates a media board and adds default and custom rows to `media`.
 */
export function addMedia(
  payload: ExtractPayload<"add_media">,
  workspace: Workspace,
  options: ValidationOptions = {},
): Workspace {
  if (!rules.mutations.create.board.allowed) {
    return workspace
  }

  return produce(workspace, (draft) => {
    if (!draft.media) {
      draft.media = {}
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

    const defaultEntryId = `media-${componentKey}-default`
    const variantEntryId = `media-${componentKey}-custom-${Date.now()}`

    draft.media[defaultEntryId] = { id: defaultEntryId }
    draft.media[variantEntryId] = { id: variantEntryId }

    const board = {
      type: "media" as const,
      catalogId: componentKey,
      label: formatLabelFromCatalogId(componentKey, "Media"),
      componentPreview: "seldonMediaPreview",
      componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
      componentProperties: getInitialBoardComponentProperties("media"),
      variants: [{ id: defaultEntryId }, { id: variantEntryId }],
    }
    setComponentOrder(board, maxOrder + 1)
    draft.components[componentKey] = board

    const updatedWorkspace = workspacePropagationService.realignComponentOrder(draft)
    Object.assign(draft.components, updatedWorkspace.components)
  })
}
