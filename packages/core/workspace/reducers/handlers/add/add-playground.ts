import { produce } from "immer"
import { getInitialBoardComponentProperties } from "../../../helpers/components/get-initial-board-component-properties"
import { ComponentId } from "../../../../components/constants"
import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  getBoardOrder,
  setBoardOrder,
} from "../../../helpers/components/board-sort-order"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../../../helpers/themes/workspace-editable-theme"
import { formatNodeCatalog } from "../../../model/template-ref"
import { boardOrderService } from "../../../services"

/**
 * Creates a playground board and its default frame root node when the board key is free.
 * Returns the current workspace when rules disallow board creation or a board already exists at `boardKey`.
 */
export function addPlayground(
  payload: ExtractPayload<"add_playground">,
  workspace: Workspace,
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

    const defaultNodeId = `playground-${boardKey}-default`

    draft.nodes[defaultNodeId] = {
      id: defaultNodeId,
      type: "default",
      level: "frame",
      label: "Playground",
      theme: null,
      template: formatNodeCatalog(ComponentId.FRAME),
      overrides: {},
      __editor: { initialOverrides: {} },
    }

    const board = {
      type: "playground" as const,
      label: "Playground",
      componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
      componentProperties: getInitialBoardComponentProperties("playground"),
      variants: [{ id: defaultNodeId }],
    }
    setBoardOrder(board, maxOrder + 1)
    draft.components[boardKey] = board

    const updatedWorkspace = boardOrderService.realignBoardOrder(draft)
    Object.assign(draft.components, updatedWorkspace.components)
  })
}
