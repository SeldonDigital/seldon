import { defineTool } from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { commit, textResult } from "./commit"

import type { PiTurnState } from "../turn-state"
import type { ToolDefinition } from "@earendil-works/pi-coding-agent"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

/** Removes an instance node by its id. */
export function createRemoveInstanceTool(state: PiTurnState): ToolDefinition {
  return defineTool({
    name: "remove_instance",
    label: "Remove Instance",
    description: "Remove an instance node by its id.",
    parameters: Type.Object({
      instanceId: Type.String({
        description: "Instance node id from the context.",
      }),
    }),

    execute: async (_id, params) =>
      textResult(
        commit(state, {
          type: "remove_instance",
          payload: { instanceId: params.instanceId },
        } as WorkspaceAction),
      ),
  })
}
