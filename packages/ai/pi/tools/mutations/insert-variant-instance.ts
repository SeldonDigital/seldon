import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import type { WorkspaceAction } from "@seldon/core/workspace/types"

import type { PiTurnState } from "../turn-state"
import { commit, textResult } from "./commit"
import { withCreatedIdentity } from "./created-nodes"

/** Inserts an instance of an existing variant under an existing parent node. */
export function createInsertVariantInstanceTool(
  state: PiTurnState,
): ToolDefinition {
  return defineTool({
    name: "insert_variant_instance",
    label: "Insert Variant Instance",
    description:
      "Insert an instance of a specific existing variant under an existing parent node. Use insert_component to add a component from the catalog by its catalog id.",
    parameters: Type.Object({
      variantId: Type.String({
        description: "Variant node id from the context.",
      }),
      parentId: Type.String({ description: "Existing parent node id." }),
      index: Type.Optional(
        Type.Number({
          description: "Insertion index among the parent's children.",
        }),
      ),
    }),
    execute: async (_id, params) => {
      const before = state.workspace
      const message = commit(state, {
        type: "insert_variant_instance",
        payload: {
          variantId: params.variantId,
          target: { parentId: params.parentId, index: params.index },
        },
      } as WorkspaceAction)
      return textResult(withCreatedIdentity(before, state.workspace, message))
    },
  })
}
