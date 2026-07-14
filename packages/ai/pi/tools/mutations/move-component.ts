import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import type { WorkspaceAction } from "@seldon/core/workspace/types"

import type { PiTurnState } from "../turn-state"
import { commit, textResult } from "./commit"

/**
 * Relocates an instance under a new parent within the same variant. The reducer
 * rejects a move across variants, into a default variant, into the instance's
 * own subtree, or under a parent whose level cannot hold it.
 */
export function createMoveComponentTool(state: PiTurnState): ToolDefinition {
  return defineTool({
    name: "move_component",
    label: "Move Component",
    description:
      "Move an existing instance under a new parent node in the same variant. Only nest what the hierarchy allows.",
    parameters: Type.Object({
      instanceId: Type.String({
        description: "Instance node id to move, from the context.",
      }),
      parentId: Type.String({ description: "New parent node id." }),
      index: Type.Optional(
        Type.Number({
          description: "Insertion index among the parent's children.",
        }),
      ),
    }),
    execute: async (_id, params) =>
      textResult(
        commit(state, {
          type: "move_instance",
          payload: {
            instanceId: params.instanceId,
            target: { parentId: params.parentId, index: params.index },
          },
        } as WorkspaceAction),
      ),
  })
}
