import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import type { WorkspaceAction } from "@seldon/core/workspace/types"

import type { PiTurnState } from "../turn-state"
import { commit, textResult } from "./commit"

/** Renames a board by its key. */
export function createSetBoardLabelTool(state: PiTurnState): ToolDefinition {
  return defineTool({
    name: "set_board_label",
    label: "Set Board Label",
    description: "Rename a board by its key.",
    parameters: Type.Object({
      boardKey: Type.String({ description: "Board key from the context." }),
      label: Type.String({ description: "New board label." }),
    }),
    execute: async (_id, params) =>
      textResult(
        commit(state, {
          type: "set_board_label",
          payload: { boardKey: params.boardKey, label: params.label },
        } as WorkspaceAction),
      ),
  })
}
