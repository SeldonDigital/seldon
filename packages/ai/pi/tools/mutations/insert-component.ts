import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import type { WorkspaceAction } from "@seldon/core/workspace/types"

import type { PiTurnState } from "../turn-state"
import { resolveCatalogId } from "./catalog-ids"
import { commit, textResult } from "./commit"
import { withCreatedIdentity } from "./created-nodes"

/**
 * Inserts a catalog component's default instance under an existing parent node.
 * Board existence decides the action, so the model does not: a missing board is
 * created and inserted in one step, an existing board is inserted into. The
 * parent's level must allow the component, or the reducer rejects the insert.
 */
export function createInsertComponentTool(state: PiTurnState): ToolDefinition {
  return defineTool({
    name: "insert_component",
    label: "Insert Component",
    description:
      "Insert a catalog component under an existing parent node (for example the selection). Pass its catalog id (from list_catalog_ids). Creates the board if it does not exist yet. Only nest what the hierarchy allows.",
    parameters: Type.Object({
      catalogId: Type.String({
        description:
          "Catalog id of the component to insert (from list_catalog_ids).",
      }),
      parentId: Type.String({ description: "Existing parent node id." }),
      index: Type.Optional(
        Type.Number({
          description: "Insertion index among the parent's children.",
        }),
      ),
    }),
    execute: async (_id, params) => {
      const resolved = resolveCatalogId(params.catalogId)
      if (!resolved.id) return textResult(resolved.message ?? "Unknown catalog id.")
      const catalogId = resolved.id
      const action: WorkspaceAction = state.workspace.boards[catalogId]
        ? ({
            type: "insert_default_instance",
            payload: {
              boardKey: catalogId,
              parentId: params.parentId,
              index: params.index,
            },
          } as WorkspaceAction)
        : ({
            type: "add_component_and_insert_default_instance",
            payload: {
              boardKey: catalogId,
              target: { parentId: params.parentId, index: params.index },
            },
          } as WorkspaceAction)
      const before = state.workspace
      const applied = commit(state, action)
      const message = resolved.note ? `${resolved.note}\n${applied}` : applied
      return textResult(withCreatedIdentity(before, state.workspace, message))
    },
  })
}
