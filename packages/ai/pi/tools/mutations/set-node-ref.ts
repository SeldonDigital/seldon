import { defineTool } from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { resolveNodeTarget } from "../resolve-target"
import { commit, textResult } from "./commit"

import type { ResolvedContext } from "../../editor-context"
import type { TargetSpec } from "../resolve-target"
import type { PiTurnState } from "../turn-state"
import type { ToolDefinition } from "@earendil-works/pi-coding-agent"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

/**
 * Sets a node's ref, the code-name handle that drives its exported identifier
 * and file name. A ref is owned per node, instances included, and never
 * propagates, so this always writes the exact resolved node. An empty ref
 * clears it and the export falls back to the component file name.
 */
export function createSetNodeRefTool(
  state: PiTurnState,
  resolved: ResolvedContext,
): ToolDefinition {
  return defineTool({
    name: "set_node_ref",
    label: "Set Node Ref",
    description:
      "Set a node's code-name (ref handle) used as its exported identifier and file name. Applies to the exact node, including instances. Pass an empty ref to clear it.",
    parameters: Type.Object({
      target: Type.Union([Type.Literal("selection"), Type.Object({ nodeId: Type.String() })], {
        description: '"selection" for the selected node, or { "nodeId" } from the context.',
      }),
      ref: Type.String({
        description: "The code name. Empty string clears the ref.",
      }),
      match: Type.Optional(
        Type.String({
          description: "Label or catalog id to locate the node when out of scope.",
        }),
      ),
    }),

    execute: async (_id, params) => {
      const resolution = resolveNodeTarget(
        state.workspace,
        resolved.resolvedKey,
        resolved.selectedNodeId,
        resolved.selectedBoardId,
        params.target as TargetSpec,
        params.match,
        resolved.scope,
        resolved.isolation?.allowedBoardKeys,
      )

      if (resolution.kind === "message") return textResult(resolution.text)

      return textResult(
        commit(state, {
          type: "set_node_ref",
          payload: { nodeId: resolution.nodeId, ref: params.ref.trim() },
        } as WorkspaceAction),
      )
    },
  })
}
