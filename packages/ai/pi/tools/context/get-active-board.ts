import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { activeBoardSection } from "../../../prompt/context-sections/active-board"
import type { ResolvedContext } from "../../editor-context"
import { textResult } from "./shared"

/** Returns the active board's variant node trees with ids, levels, catalog ids. */
export function createGetActiveBoardTool(
  resolved: ResolvedContext,
): ToolDefinition {
  const { workspace, resolvedKey, activeBoard } = resolved
  return defineTool({
    name: "get_active_board",
    label: "Get Active Board",
    description:
      "Return the active board's variant node trees: each node's id, level, and catalog id.",
    parameters: Type.Object({}),
    execute: async () => {
      if (
        !activeBoard ||
        activeBoard.type !== "component" ||
        resolvedKey === undefined
      ) {
        return textResult("No active component board is selected.")
      }
      return textResult(
        activeBoardSection(workspace, resolvedKey, activeBoard).lines.join(
          "\n",
        ),
      )
    },
  })
}
