import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { authoredBoardKeyFromName } from "@seldon/core/workspace/helpers/components/authored-board-key"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

import type { PiTurnState } from "../turn-state"
import { commit, textResult } from "./commit"
import { withCreatedIdentity } from "./created-nodes"

/**
 * Creates an authored component: a user-defined board with no catalog schema,
 * rooted in a Frame or Container at a declared level. The board key derives from
 * the name, so there is no parent to pick. Fill it afterward with
 * insert_component, and favor reusing an existing catalog or workspace component
 * over creating another authored one.
 */
export function createCreateAuthoredComponentTool(
  state: PiTurnState,
): ToolDefinition {
  return defineTool({
    name: "create_authored_component",
    label: "Create Authored Component",
    description:
      "Create an authored component board (a user-defined component with no catalog schema). The board key derives from the name, so no parent is needed. Root it in a Frame or Container, then fill it with insert_component, reusing existing catalog or workspace components before creating new ones.",
    parameters: Type.Object({
      name: Type.String({
        description:
          "Human name for the component. The board key and export name derive from it.",
      }),
      level: Type.Union(
        [
          Type.Literal("element"),
          Type.Literal("part"),
          Type.Literal("module"),
          Type.Literal("screen"),
        ],
        {
          description:
            "Declared component level. Controls what the component may contain and its export folder.",
        },
      ),
      rootKind: Type.Optional(
        Type.Union([Type.Literal("frame"), Type.Literal("container")], {
          description:
            "Root template: a Frame or a flex Container. Defaults to frame.",
          default: "frame",
        }),
      ),
      intent: Type.Optional(
        Type.String({ description: "Short description of the component." }),
      ),
      tags: Type.Optional(
        Type.Array(Type.String(), {
          description: "Optional tags for the component.",
        }),
      ),
    }),
    execute: async (_id, params) => {
      const boardKey = authoredBoardKeyFromName(params.name)
      if (!boardKey) {
        return textResult(
          "Authored component name must contain a letter or number.",
        )
      }
      if (
        state.workspace.boards[boardKey] ||
        state.workspace.playgrounds?.[boardKey]
      ) {
        return textResult(
          `A component with the key "${boardKey}" already exists in this workspace. Pick a different name, or edit the existing board.`,
        )
      }

      const before = state.workspace
      const applied = commit(state, {
        type: "add_authored_component",
        payload: {
          name: params.name,
          rootKind: params.rootKind ?? "frame",
          level: params.level,
          intent: params.intent,
          tags: params.tags,
        },
      } as WorkspaceAction)
      return textResult(withCreatedIdentity(before, state.workspace, applied))
    },
  })
}
