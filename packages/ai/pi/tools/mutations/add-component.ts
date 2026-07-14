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
 * Adds a component from the catalog to the workspace, which materializes its
 * board. There is no separate "make a board" step: adding the catalog component
 * is what creates the board. To place an instance inside an existing node, use
 * insert_component instead.
 */
export function createAddComponentTool(state: PiTurnState): ToolDefinition {
  return defineTool({
    name: "add_component",
    label: "Add Component",
    description:
      "Add a component from the catalog to the workspace as its own board. Pass its catalog id (from list_catalog_ids). To place it inside an existing node, use insert_component.",
    parameters: Type.Object({
      catalogId: Type.String({
        description:
          "Catalog id of the component to add (from list_catalog_ids).",
      }),
    }),
    execute: async (_id, params) => {
      const resolved = resolveCatalogId(params.catalogId)
      if (!resolved.id) return textResult(resolved.message ?? "Unknown catalog id.")
      const catalogId = resolved.id
      if (state.workspace.boards[catalogId]) {
        return textResult(
          `Component "${catalogId}" is already in the workspace. Select its board, or use insert_component to place an instance of it under a parent node.`,
        )
      }
      const before = state.workspace
      const applied = commit(state, {
        type: "add_component",
        payload: { boardKey: catalogId },
      } as WorkspaceAction)
      const message = resolved.note ? `${resolved.note}\n${applied}` : applied
      return textResult(withCreatedIdentity(before, state.workspace, message))
    },
  })
}
