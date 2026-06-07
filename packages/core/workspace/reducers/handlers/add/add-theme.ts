import { produce } from "immer"
import { getInitialBoardComponentProperties } from "../../../helpers/components/get-initial-board-component-properties"
import { isComponentId } from "../../../../components/constants"
import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  getBoardOrder,
  setBoardOrder,
} from "../../../helpers/components/board-sort-order"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../../../helpers/themes/workspace-editable-theme"
import { formatThemeCatalog } from "../../../model/template-ref"
import { STOCK_THEMES_BY_ID } from "../../../../themes/catalog"
import type { ThemeTemplateId } from "../../../../themes/types/theme-id"
import {
  workspaceMutationService,
  workspacePropagationService,
} from "../../../services"
import type { ValidationOptions } from "../../helpers/validation"

/**
 * Inserts a theme board and one `themes` row: a default row rooted at `catalog:{boardKey}`.
 *
 * Returns the incoming workspace when creation is blocked by rules, when validation fails, or when `workspace.components[boardKey]` already exists.
 */
export function addTheme(
  payload: ExtractPayload<"add_theme">,
  workspace: Workspace,
  options: ValidationOptions = {},
): Workspace {
  if (!rules.mutations.create.board.allowed) {
    return workspace
  }

  return produce(workspace, (draft) => {
    const boardKey = payload.boardKey

    if (draft.components[boardKey]) {
      return draft
    }

    const existingBoards = Object.values(draft.components)
    const maxOrder =
      existingBoards.length > 0
        ? Math.max(...existingBoards.map((b) => getBoardOrder(b)))
        : -1

    const defaultThemeEntryId = `theme-${boardKey}-default`

    const stockTheme = STOCK_THEMES_BY_ID[boardKey as ThemeTemplateId]
    const label = stockTheme
      ? stockTheme.metadata.name
      : isComponentId(boardKey)
        ? workspaceMutationService.getInitialComponentLabel(boardKey)
        : boardKey

    draft.themes[defaultThemeEntryId] = {
      id: defaultThemeEntryId,
      type: "default",
      label: "Default",
      template: formatThemeCatalog(boardKey),
      overrides: {},
    }

    const board = {
      type: "theme" as const,
      catalogId: boardKey,
      label,
      author: "Seldon Digital",
      componentPreview: "seldonThemePreview",
      componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
      componentProperties: getInitialBoardComponentProperties("theme"),
      variants: [{ id: defaultThemeEntryId }],
    }
    setBoardOrder(board, maxOrder + 1)
    draft.components[boardKey] = board

    const updatedWorkspace = workspacePropagationService.realignBoardOrder(draft)
    Object.assign(draft.components, updatedWorkspace.components)
  })
}
