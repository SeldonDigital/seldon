import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import type { WorkspaceAction } from "@seldon/core/workspace/types"

import { ALL_ACTION_TYPES } from "../../../schema/action-schema"
import type { PiTurnState } from "../turn-state"
import { commit, textResult } from "./commit"

const KNOWN_ACTION_TYPES = new Set(ALL_ACTION_TYPES)

/**
 * Batches many edits in one call and is the escape hatch for the long tail of
 * action types that lack a dedicated tool. Each action is validated in order
 * against the working copy and reported on its own line, so the model resends
 * only the ones marked rejected.
 */
export function createApplyActionsTool(state: PiTurnState): ToolDefinition {
  return defineTool({
    name: "apply_actions",
    label: "Apply Actions",
    description:
      'Apply several workspace actions in one call, in order. Prefer this over repeated calls: put every edit in one call. Also the escape hatch for actions without a dedicated tool. Each item is { "type", "payload" }; they run top to bottom, so create a node before setting its properties. Call get_action_spec when unsure of payload keys. Resend only items marked "rejected".',
    parameters: Type.Object({
      actions: Type.Array(
        Type.Object({
          type: Type.String({
            description: "One of the allowed action types.",
          }),
          payload: Type.Record(Type.String(), Type.Unknown()),
        }),
        { description: "Actions to apply, in order." },
      ),
    }),
    execute: async (_id, params) => {
      if (params.actions.length === 0) {
        return textResult("No actions provided.")
      }
      const lines = params.actions.map((action, index) => {
        const position = index + 1
        if (!KNOWN_ACTION_TYPES.has(action.type)) {
          return `${position}. ${action.type} rejected: unknown action type. Allowed types: ${ALL_ACTION_TYPES.join(", ")}.`
        }
        try {
          return `${position}. ${commit(state, {
            type: action.type,
            payload: action.payload,
          } as WorkspaceAction)}`
        } catch (caught) {
          const reason =
            caught instanceof Error ? caught.message : "invalid action"
          return `${position}. ${action.type} rejected: ${reason}`
        }
      })
      return textResult(lines.join("\n"))
    },
  })
}
