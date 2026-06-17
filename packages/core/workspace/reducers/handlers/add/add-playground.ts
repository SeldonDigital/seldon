import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  getBoardOrder,
  setBoardOrder,
} from "../../../helpers/components/board-sort-order"
import { getInitialBoardComponentProperties } from "../../../helpers/components/get-initial-board-component-properties"
import { buildSandboxNode } from "../../../helpers/nodes/sandbox"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../../../helpers/themes/workspace-editable-theme"

/**
 * Creates an empty playground container row in `workspace.playgrounds` when the
 * key is free. A playground is a sidebar-only grouping container with no hidden
 * root: its Sandbox roots are added later through `add_sandbox`. Returns the
 * current workspace when rules disallow creation or the key is taken.
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

    if (draft.boards[boardKey] || draft.playgrounds[boardKey]) {
      return draft
    }

    const existing = Object.values(draft.playgrounds)
    const maxOrder =
      existing.length > 0
        ? Math.max(...existing.map((p) => getBoardOrder(p)))
        : -1

    // Seed one Sandbox at 0,0 sized 800x600 so a new playground is never empty.
    const { id: sandboxId, node: sandboxNode } = buildSandboxNode(boardKey)

    const container = {
      type: "playground" as const,
      id: boardKey,
      label: "Playground",
      componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
      componentProperties: getInitialBoardComponentProperties("playground"),
      variants: [{ id: sandboxId }],
    }
    setBoardOrder(container, maxOrder + 1)
    draft.playgrounds[boardKey] = container
    draft.nodes[sandboxId] = sandboxNode
  })
}
