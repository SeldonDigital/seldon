import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { boardSummarySection } from "../../../prompt/context-sections/board-summary"
import type { ResolvedContext } from "../../editor-context"
import { joinOrEmpty, textResult } from "./shared"

/** Returns a cheap summary of the active board, with no ids, to locate a target. */
export function createBoardSummaryTool(
  resolved: ResolvedContext,
): ToolDefinition {
  const { workspace, resolvedKey, activeBoard } = resolved
  return defineTool({
    name: "board_summary",
    label: "Board Summary",
    description:
      "Return a cheap summary of the active board: each variant's name, node count, and catalog ids, with no ids. Use it to locate a target before pulling the full tree.",
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
        joinOrEmpty(
          boardSummarySection(workspace, resolvedKey, activeBoard),
          "No board summary available.",
        ),
      )
    },
  })
}
