import { produce } from "immer"

import { ComponentId } from "../../../../components/constants"
import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import { authoredBoardKeyFromName } from "../../../helpers/components/authored-board-key"
import {
  getBoardOrder,
  setBoardOrder,
} from "../../../helpers/components/board-sort-order"
import { authoredBoardRootNodeId } from "../../../helpers/components/entry-node-ids"
import { getInitialBoardComponentProperties } from "../../../helpers/components/get-initial-board-component-properties"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../../../helpers/themes/workspace-editable-theme"
import { formatNodeCatalog } from "../../../model/template-ref"
import { workspaceMutationService } from "../../../services"
import type { AuthoredComponentBoard, EntryNode } from "../../../types"

/**
 * Creates an authored component board and its single `authored` root node. The
 * root templates from a Container or Frame catalog id (the caller's pick) so it
 * inherits that property vocabulary, but the board owns the declared `level`,
 * name, and identity. There is no catalog schema and no reset-to-catalog for
 * the board or its root. Returns the workspace unchanged when creation is
 * disallowed, the derived key is empty, or the key is already taken.
 */
export function addAuthoredComponent(
  payload: ExtractPayload<"add_authored_component">,
  workspace: Workspace,
): Workspace {
  if (!rules.mutations.create.board.allowed) {
    return workspace
  }

  const boardKey = authoredBoardKeyFromName(payload.name)
  if (!boardKey) {
    return workspace
  }
  if (workspace.boards[boardKey] || workspace.playgrounds?.[boardKey]) {
    return workspace
  }

  const rootId = authoredBoardRootNodeId(boardKey)
  const rootComponentId =
    payload.rootKind === "frame" ? ComponentId.FRAME : ComponentId.CONTAINER

  return produce(workspace, (draft) => {
    const existing = Object.values(draft.boards)
    const maxOrder =
      existing.length > 0
        ? Math.max(...existing.map((board) => getBoardOrder(board)))
        : -1

    const rootNode: EntryNode = {
      id: rootId,
      type: "authored",
      level: payload.level,
      label: payload.name,
      theme: null,
      template: formatNodeCatalog(rootComponentId),
      overrides: {},
    }

    const board: AuthoredComponentBoard = {
      type: "authored-component",
      id: boardKey,
      level: payload.level,
      // Board label is a plural grouping convention ("Dialogs"); the root node
      // keeps the singular name that export and code names read.
      label: workspaceMutationService.getInitialAuthoredComponentLabel(
        payload.name,
      ),
      intent: payload.intent,
      tags: payload.tags,
      componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
      componentProperties:
        getInitialBoardComponentProperties("authored-component"),
      variants: [{ id: rootId }],
    }
    setBoardOrder(board, maxOrder + 1)
    draft.boards[boardKey] = board
    draft.nodes[rootId] = rootNode
  })
}
