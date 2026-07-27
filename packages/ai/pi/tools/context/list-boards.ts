import { defineTool } from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { workspaceBoardsSection } from "../../../prompt/context-sections/workspace-index"
import { joinOrEmpty, textResult } from "./shared"

import type { ResolvedContext } from "../../editor-context"
import type { PiTurnState } from "../turn-state"
import type { ToolDefinition } from "@earendil-works/pi-coding-agent"

/** Returns every component board, to locate one other than the active. */
export function createListBoardsTool(
  state: PiTurnState,
  resolved: ResolvedContext,
): ToolDefinition {
  return defineTool({
    name: "list_boards",
    label: "List Boards",
    description:
      "Return every component board as board key -> catalog id -> label, to locate a board other than the active one. A node on a board the user is not viewing needs the user's permission before you edit it. In Isolation Mode, each board is marked as the isolated anchor, in scope, or out of scope.",
    parameters: Type.Object({}),

    execute: async () =>
      textResult(
        joinOrEmpty(
          workspaceBoardsSection(
            state.workspace,
            resolved.isolation
              ? {
                  isolatedBoardKey: resolved.isolation.isolatedBoardKey,
                  allowedBoardKeys: resolved.isolation.allowedBoardKeys,
                }
              : undefined,
          ),
          "No boards available.",
        ),
      ),
  })
}
