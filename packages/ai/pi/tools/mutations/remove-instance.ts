import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import type { WorkspaceAction } from "@seldon/core/workspace/types"

import type { PiTurnState } from "../turn-state"
import { commit, textResult } from "./commit"

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
