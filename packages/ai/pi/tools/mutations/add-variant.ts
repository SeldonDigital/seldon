import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import type { BoardKey, WorkspaceAction } from "@seldon/core/workspace/types"

import type { PiTurnState } from "../turn-state"
import { commit, textResult } from "./commit"
import { withCreatedIdentity } from "./created-nodes"

/**
 * Adds a new variant to a board. Works on component, authored, and playground
 * boards, which all own a variant list. Returns the new variant root id so the
 * model can keep editing it in the same turn.
 */
export function createAddVariantTool(state: PiTurnState): ToolDefinition {
  return defineTool({
    name: "add_variant",
    label: "Add Variant",
    description:
      "Add a new variant to a component, authored, or playground board by its board key (from the context or list_boards).",
    parameters: Type.Object({
      boardKey: Type.String({ description: "Board key from the context." }),
    }),
    execute: async (_id, params) => {
      const before = state.workspace
      const applied = commit(state, {
        type: "add_variant",
        payload: { boardKey: params.boardKey as BoardKey },
      } as WorkspaceAction)
      return textResult(withCreatedIdentity(before, state.workspace, applied))
    },
  })
}
