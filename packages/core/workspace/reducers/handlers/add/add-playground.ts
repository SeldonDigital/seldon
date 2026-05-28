import { produce } from "immer"
import { getInitialBoardComponentProperties } from "../../../helpers/components/get-initial-board-component-properties"
import { ComponentId } from "../../../../components/constants"
import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  getComponentOrder,
  setComponentOrder,
} from "../../../helpers/components/component-sort-order"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../../../helpers/themes/workspace-editable-theme"
import { formatNodeCatalog } from "../../../model/template-ref"
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

/**
 * Creates a playground board and its default frame root node when the board key is free.
 *
 * Returns the current workspace when board creation is disallowed by rules or when a board already exists at `componentKey`.
 *
 * @param payload ComponentEntry key for `workspace.components` and generated default node id.
 * @param workspace Current workspace.
 * @param options Optional validation logging for strict or AI-driven flows.
 * @returns Workspace with the new board and node, or the unchanged workspace.
 */
export function addPlayground(
  payload: ExtractPayload<"add_playground">,
  workspace: Workspace,
  options: ValidationOptions = {},
): Workspace {
  if (!rules.mutations.create.board.allowed) {
    return workspace
  }

  return produce(workspace, (draft) => {
    const componentKey = payload.componentKey

    if (draft.components[componentKey]) {
      return draft
    }

    const existingBoards = Object.values(draft.components)
    const maxOrder =
      existingBoards.length > 0
        ? Math.max(...existingBoards.map((b) => getComponentOrder(b)))
        : -1

    const defaultNodeId = `playground-${componentKey}-default`

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
    setComponentOrder(board, maxOrder + 1)
    draft.components[componentKey] = board

    const updatedWorkspace = workspacePropagationService.realignComponentOrder(draft)
    Object.assign(draft.components, updatedWorkspace.components)
  })
}
