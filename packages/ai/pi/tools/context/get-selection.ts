import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { selectionSection } from "../../../prompt/context-sections/selection"
import type { ResolvedContext } from "../../editor-context"
import type { PiTurnState } from "../turn-state"
import { joinOrEmpty, textResult } from "./shared"

/** Returns the node selected on the canvas, with its identity and set properties. */
export function createGetSelectionTool(
  state: PiTurnState,
  resolved: ResolvedContext,
): ToolDefinition {
  const { resolvedKey, selectedNodeId, selectedNodeRootId } = resolved
  return defineTool({
    name: "get_selection",
    label: "Get Selection",
    description:
      "Return the node the user has selected on the canvas, with its id, level, parent, children, and set properties.",
    parameters: Type.Object({}),
    execute: async () => {
      const workspace = state.workspace
      const activeBoard =
        resolvedKey !== undefined ? workspace.boards[resolvedKey] : undefined
      return textResult(
        joinOrEmpty(
          selectionSection(
            workspace,
            activeBoard,
            selectedNodeId,
            selectedNodeRootId,
          ),
          "No node is selected.",
        ),
      )
    },
  })
}
