import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { buildActionPayloadSpecs } from "../../../schema/action-schema"
import { joinOrEmpty, textResult } from "./shared"

/** Returns the payload spec for one or more workspace action types. */
export function createGetActionSpecTool(): ToolDefinition {
  return defineTool({
    name: "get_action_spec",
    label: "Get Action Spec",
    description:
      "Return the payload spec (required and optional keys) for one or more action types. Call before apply_actions when unsure of a payload shape.",
    parameters: Type.Object({
      types: Type.Array(Type.String(), {
        description: "Action type names, for example set_node_properties.",
      }),
    }),
    execute: async (_id, params) =>
      textResult(
        joinOrEmpty(
          buildActionPayloadSpecs(params.types),
          "No matching action types. Call list_action_types for valid names.",
        ),
      ),
  })
}
