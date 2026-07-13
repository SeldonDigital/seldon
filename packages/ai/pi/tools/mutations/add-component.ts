import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import type { WorkspaceAction } from "@seldon/core/workspace/types"

import type { PiTurnState } from "../turn-state"
import { commit, textResult } from "./commit"

/** Adds a catalog component instance under an existing parent node. */
export function createAddComponentTool(state: PiTurnState): ToolDefinition {
  return defineTool({
    name: "add_component",
    label: "Add Component",
    description:
      "Add a component instance from the catalog under an existing parent node. Only nest what the hierarchy allows.",
    parameters: Type.Object({
      boardKey: Type.String({
        description: "Catalog id of the component to add.",
      }),
      parentId: Type.String({ description: "Existing parent node id." }),
      index: Type.Optional(
        Type.Number({
          description: "Insertion index among the parent's children.",
        }),
      ),
    }),
    execute: async (_id, params) =>
      textResult(
        commit(state, {
          type: "add_component_and_insert_default_instance",
          payload: {
            boardKey: params.boardKey,
            target: { parentId: params.parentId, index: params.index },
          },
        } as WorkspaceAction),
      ),
  })
}
