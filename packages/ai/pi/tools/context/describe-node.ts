import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { describeNodeSection } from "../../../prompt/context-sections/describe-node"
import type { PiTurnState } from "../turn-state"
import { joinOrEmpty, textResult } from "./shared"

/** Returns a shallow view of one node: identity, parent, children, set properties. */
export function createDescribeNodeTool(state: PiTurnState): ToolDefinition {
  return defineTool({
    name: "describe_node",
    label: "Describe Node",
    description:
      "Return a shallow view of one node: identity, parent, immediate children, and set properties. Call on a child id to expand only that branch.",
    parameters: Type.Object({
      nodeId: Type.String({
        description: "Node id to describe, from the context or a read tool.",
      }),
    }),
    execute: async (_id, params) =>
      textResult(
        joinOrEmpty(
          describeNodeSection(state.workspace, params.nodeId),
          `No node found for id "${params.nodeId}".`,
        ),
      ),
  })
}
