import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import type { WorkspaceAction } from "@seldon/core/workspace/types"

import type { PiTurnState } from "../turn-state"
import { commit, textResult } from "./commit"

/** Reorders an instance among its siblings under the same parent. */
export function createReorderComponentTool(
  state: PiTurnState,
): ToolDefinition {
  return defineTool({
    name: "reorder_component",
    label: "Reorder Component",
    description:
      "Move an existing instance to a new position among its siblings under the same parent.",
    parameters: Type.Object({
      instanceId: Type.String({
        description: "Instance node id to reorder, from the context.",
      }),
      index: Type.Number({
        description: "New index among the parent's children.",
      }),
    }),
    execute: async (_id, params) =>
      textResult(
        commit(state, {
          type: "reorder_instance_in_parent",
          payload: {
            instanceId: params.instanceId,
            newIndex: params.index,
          },
        } as WorkspaceAction),
      ),
  })
}
