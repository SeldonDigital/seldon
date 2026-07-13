import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { nodePropertiesSection } from "../../../prompt/context-sections/node-properties"
import type { ResolvedContext } from "../../editor-context"
import { joinOrEmpty, textResult } from "./shared"

/** Returns the effective, merged property values for one node. */
export function createGetNodePropertiesTool(
  resolved: ResolvedContext,
): ToolDefinition {
  const { workspace } = resolved
  return defineTool({
    name: "get_node_properties",
    label: "Get Node Properties",
    description:
      "Return the effective, merged property values for one node. Use it to read what a value resolves to before editing.",
    parameters: Type.Object({
      nodeId: Type.String({
        description: "Node id whose effective properties you need.",
      }),
    }),
    execute: async (_id, params) =>
      textResult(
        joinOrEmpty(
          nodePropertiesSection(workspace, params.nodeId),
          `No properties found for node "${params.nodeId}".`,
        ),
      ),
  })
}
