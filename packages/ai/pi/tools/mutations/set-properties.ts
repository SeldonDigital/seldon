import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { getSourceNodeId } from "@seldon/core/workspace/helpers/components/get-source-node-id"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

import type { ResolvedContext } from "../../editor-context"
import { type TargetSpec, resolveNodeTarget } from "../resolve-target"
import type { PiTurnState } from "../turn-state"
import { commit, textResult } from "./commit"

/**
 * The primary edit tool: change a node's properties. It resolves the target
 * through the scope ladder, then writes either a local instance override or the
 * component source depending on the effective scope, and reports which one it
 * used so the model can describe the reach in its summary.
 */
export function createSetPropertiesTool(
  state: PiTurnState,
  resolved: ResolvedContext,
): ToolDefinition {
  // The default write scope follows the selection scope: an instance selection
  // stays local, while board, variant, and workspace selections cascade by
  // writing the component source. The model may still pass an explicit scope.
  const defaultScope = resolved.scope === "instance" ? "instance" : "all"

  return defineTool({
    name: "set_properties",
    label: "Set Properties",
    description: `Primary tool to change a node's properties. Values may be loose: a bare string or number becomes an exact value, an "@scope.key" string becomes a theme reference. Default scope is "${defaultScope}".`,
    parameters: Type.Object({
      target: Type.Union(
        [Type.Literal("selection"), Type.Object({ nodeId: Type.String() })],
        {
          description:
            '"selection" for the selected node, or { "nodeId" } from the context.',
        },
      ),
      scope: Type.Optional(
        Type.Union([Type.Literal("instance"), Type.Literal("all")], {
          description: `"instance" overrides this node; "all" edits the component source so every instance follows. Default "${defaultScope}".`,
        }),
      ),
      properties: Type.Record(Type.String(), Type.Unknown()),
      match: Type.Optional(
        Type.String({
          description:
            "Label or catalog id to locate the node when out of scope.",
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
      )
      if (resolution.kind === "message") return textResult(resolution.text)

      const scope = params.scope ?? defaultScope
      const writeNodeId =
        scope === "all"
          ? getSourceNodeId(state.workspace, resolution.nodeId)
          : resolution.nodeId

      const outcome = commit(state, {
        type: "set_node_properties",
        payload: { nodeId: writeNodeId, properties: params.properties },
      } as WorkspaceAction)

      const scopeNote =
        scope === "all"
          ? `Scope all: wrote the component source ${writeNodeId}; every instance without its own override for these properties now follows.`
          : `Scope instance: wrote ${writeNodeId} as a local override.`
      return textResult(`${outcome}\n${scopeNote}`)
    },
  })
}
