import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { workspaceBoardsSection } from "../../../prompt/context-sections/workspace-index"
import type { PiTurnState } from "../turn-state"
import { joinOrEmpty, textResult } from "./shared"

/** Returns every component board, to locate one other than the active. */
export function createListBoardsTool(state: PiTurnState): ToolDefinition {
  return defineTool({
    name: "list_boards",
    label: "List Boards",
    description:
      "Return every component board as board key -> catalog id -> label, to locate a board other than the active one. A node on a board the user is not viewing needs the user's permission before you edit it.",
    parameters: Type.Object({}),
    execute: async () =>
      textResult(
        joinOrEmpty(
          workspaceBoardsSection(state.workspace),
          "No boards available.",
        ),
      ),
  })
}
