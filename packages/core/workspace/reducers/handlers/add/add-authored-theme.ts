import { produce } from "immer"

import { rules } from "../../../../rules/config/rules.config"
import { getBoardOrder, setBoardOrder } from "../../../helpers/components/board-sort-order"
import { DEFAULT_THEME_BOARD_AUTHOR } from "../../../helpers/components/default-board-metadata"
import { getInitialBoardComponentProperties } from "../../../helpers/components/get-initial-board-component-properties"
import { formatEntryId } from "../../../helpers/general/entry-id"
import { DEFAULT_THEME_BOARD_KEY } from "../../../helpers/seed/seed-default-theme-board"
import { getUniqueThemeBoardLabel } from "../../../helpers/themes/theme-label"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../../../helpers/themes/workspace-editable-theme"
import { formatThemeCatalog } from "../../../model/template-ref"
import { boardOrderService } from "../../../services"

import type { ExtractPayload, Workspace } from "../../../../index"

/** Default name for a newly authored theme, made unique against existing theme boards. */
const NEW_THEME_LABEL = "New Theme"

/**
 * Inserts an authored theme board and one default `themes` row templated at
 * `catalog:seldon`, so the new theme starts from the Seldon tokens and layers
 * user overrides on top. The board `label` is a unique default name the user can
 * rename. Returns the incoming workspace when rules block creation or
 * `workspace.boards[boardKey]` already exists.
 */
export function addAuthoredTheme(
  payload: ExtractPayload<"add_authored_theme">,
  workspace: Workspace,
): Workspace {
  if (!rules.mutations.create.board.allowed) {
    return workspace
  }

  return produce(workspace, (draft) => {
    const boardKey = payload.boardKey

    if (draft.boards[boardKey]) {
      return draft
    }

    const existingBoards = Object.values(draft.boards)
    const maxOrder =
      existingBoards.length > 0 ? Math.max(...existingBoards.map((b) => getBoardOrder(b))) : -1

    const defaultThemeEntryId = formatEntryId("theme", boardKey, "default")
    const label = getUniqueThemeBoardLabel(draft, NEW_THEME_LABEL)

    draft.themes[defaultThemeEntryId] = {
      id: defaultThemeEntryId,
      type: "default",
      label: "Default",
      template: formatThemeCatalog(DEFAULT_THEME_BOARD_KEY),
      overrides: {},
    }

    const board = {
      type: "theme" as const,
      catalogId: boardKey,
      label,
      author: DEFAULT_THEME_BOARD_AUTHOR,
      componentPreview: "seldonThemePreview",
      componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
      componentProperties: getInitialBoardComponentProperties("theme"),
      variants: [{ id: defaultThemeEntryId }],
    }

    setBoardOrder(board, maxOrder + 1)
    draft.boards[boardKey] = board

    const updatedWorkspace = boardOrderService.realignBoardOrder(draft)

    Object.assign(draft.boards, updatedWorkspace.boards)
  })
}
