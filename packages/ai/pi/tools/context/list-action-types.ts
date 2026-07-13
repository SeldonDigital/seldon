import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { buildActionReference } from "../../../schema/action-schema"
import { joinOrEmpty, textResult } from "./shared"

/** Returns every workspace action type name, grouped by domain. */
export function createListActionTypesTool(): ToolDefinition {
  return defineTool({
    name: "list_action_types",
    label: "List Action Types",
    description:
      "Return every workspace action type name, grouped by domain. Use to discover an action for apply_actions, then get_action_spec for its payload.",
    parameters: Type.Object({}),
    execute: async () =>
      textResult(
        joinOrEmpty([buildActionReference()], "No action types available."),
      ),
  })
}
