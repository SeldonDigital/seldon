import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import {
  isAuthoredBoard,
  isComponentBoard,
} from "@seldon/core/workspace/model/components"

import { boardSummarySection } from "../../../prompt/context-sections/board-summary"
import type { ResolvedContext } from "../../editor-context"
import type { PiTurnState } from "../turn-state"
import { joinOrEmpty, textResult } from "./shared"

/** Returns a cheap summary of the active board, with no ids, to locate a target. */
export function createBoardSummaryTool(
  state: PiTurnState,
  resolved: ResolvedContext,
): ToolDefinition {
  const { resolvedKey } = resolved
  return defineTool({
    name: "board_summary",
    label: "Board Summary",
    description:
      "Return a cheap summary of the active board: each variant's name, node count, and catalog ids, with no ids. Use it to locate a target before pulling the full tree.",
    parameters: Type.Object({}),
    execute: async () => {
      const workspace = state.workspace
      const activeBoard =
        resolvedKey !== undefined ? workspace.boards[resolvedKey] : undefined
      if (
        !activeBoard ||
        (!isComponentBoard(activeBoard) && !isAuthoredBoard(activeBoard)) ||
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
