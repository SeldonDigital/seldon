import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { searchActions } from "../../../schema/action-schema"
import { joinOrEmpty, textResult } from "./shared"

/** Returns action types matching an intent, each with its payload spec. */
export function createSuggestActionTool(): ToolDefinition {
  return defineTool({
    name: "suggest_action",
    label: "Suggest Action",
    description:
      'Return action types matching an intent, each with its payload spec. Prefer over list_action_types + get_action_spec when you know the intent, for example "align".',
    parameters: Type.Object({
      query: Type.String({
        description: "Intent text to match against action type names.",
      }),
    }),
    execute: async (_id, params) =>
      textResult(
        joinOrEmpty(
          searchActions(params.query),
          `No action types match "${params.query}". Call list_action_types for the full set.`,
        ),
      ),
  })
}
