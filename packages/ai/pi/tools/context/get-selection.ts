import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { selectionSection } from "../../../prompt/context-sections/selection"
import type { ResolvedContext } from "../../editor-context"
import { joinOrEmpty, textResult } from "./shared"

/** Returns the node selected on the canvas, with its identity and set properties. */
export function createGetSelectionTool(
  resolved: ResolvedContext,
): ToolDefinition {
  const { workspace, activeBoard, selectedNodeId, selectedNodeRootId } =
    resolved
  return defineTool({
    name: "get_selection",
    label: "Get Selection",
    description:
      "Return the node the user has selected on the canvas, with its id, level, parent, children, and set properties.",
    parameters: Type.Object({}),
    execute: async () =>
      textResult(
        joinOrEmpty(
          selectionSection(
            workspace,
            activeBoard,
            selectedNodeId,
            selectedNodeRootId,
          ),
          "No node is selected.",
        ),
      ),
  })
}
