import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { ancestrySection } from "../../../prompt/context-sections/ancestry"
import type { ResolvedContext } from "../../editor-context"
import { joinOrEmpty, textResult } from "./shared"

/** Returns a node's parent chain to its variant root, for inherited color reasoning. */
export function createGetSelectionAncestryTool(
  resolved: ResolvedContext,
): ToolDefinition {
  const { workspace, selectedNodeId } = resolved
  return defineTool({
    name: "get_selection_ancestry",
    label: "Get Selection Ancestry",
    description:
      "Return a node's parent chain to its variant root, with each ancestor's set color, background, and opacity. Use it for inherited color or high contrast. Defaults to the selected node.",
    parameters: Type.Object({
      nodeId: Type.Optional(
        Type.String({
          description:
            "Node id to trace. Omit to use the node selected on the canvas.",
        }),
      ),
    }),
    execute: async (_id, params) => {
      const targetId = params.nodeId ?? selectedNodeId
      if (targetId === undefined) {
        return textResult("No node selected. Pass a nodeId to trace its ancestry.")
      }
      return textResult(
        joinOrEmpty(
          ancestrySection(workspace, targetId),
          `No node found for id "${targetId}".`,
        ),
      )
    },
  })
}
