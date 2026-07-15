import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import type { WorkspaceAction } from "@seldon/core/workspace/types"

import type { PiTurnState } from "../turn-state"
import { commit, textResult } from "./commit"
import { withCreatedIdentity } from "./created-nodes"

/**
 * Duplicates an existing node. With a parent, it pastes a copy of an instance
 * under that parent; without one, it duplicates the node in place next to its
 * source. The parent's level must allow the component, or the reducer rejects
 * the paste.
 */
export function createDuplicateComponentTool(
  state: PiTurnState,
): ToolDefinition {
  return defineTool({
    name: "duplicate_component",
    label: "Duplicate Component",
    description:
      "Duplicate an existing component. Pass parentId to paste a copy under that node (for example the selection); omit it to duplicate in place next to the original.",
    parameters: Type.Object({
      nodeId: Type.String({
        description: "Node id to duplicate, from the context.",
      }),
      parentId: Type.Optional(
        Type.String({
          description:
            "Parent node id to paste the copy under. Omit to duplicate in place.",
        }),
      ),
      index: Type.Optional(
        Type.Number({
          description: "Insertion index among the parent's children.",
        }),
      ),
    }),
    execute: async (_id, params) => {
      const action: WorkspaceAction =
        params.parentId !== undefined
          ? ({
              type: "insert_duplicate_instance",
              payload: {
                instanceId: params.nodeId,
                target: { parentId: params.parentId, index: params.index },
              },
            } as WorkspaceAction)
          : ({
              type: "duplicate_node",
              payload: { nodeId: params.nodeId },
            } as WorkspaceAction)
      const before = state.workspace
      const message = commit(state, action)
      return textResult(withCreatedIdentity(before, state.workspace, message))
    },
  })
}
