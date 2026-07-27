import { defineTool } from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import {
  listReservedStateNames,
  resolveStateName,
} from "@seldon/core/rules/config/design-semantics.resolve"
import { getSourceNodeId } from "@seldon/core/workspace/helpers/components/get-source-node-id"

import { resolveNodeTarget } from "../resolve-target"
import { commit, textResult } from "./commit"

import type { ResolvedContext } from "../../editor-context"
import type { TargetSpec } from "../resolve-target"
import type { PiTurnState } from "../turn-state"
import type { ToolDefinition } from "@earendil-works/pi-coding-agent"
import type { CustomStateChoice } from "@seldon/core/rules/config/design-semantics.resolve"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

/** The workspace custom states as name choices, or an empty list. */
function customStateChoices(workspace: Workspace): CustomStateChoice[] {
  const states = workspace.metadata.customStates ?? []

  return states.map((state) => ({ key: state.key, label: state.label }))
}

/**
 * Intent verb: style an interaction state (hover, focus, disabled, and so on).
 * A state is a per-node override bag layered over the base look, authored on a
 * variant only, so this retargets to the node's source variant; an edit landing
 * on an instance would be blocked. The state word and property values are loose,
 * resolved the same way as `set_properties`.
 */
export function createSetStateStyleTool(
  state: PiTurnState,
  resolved: ResolvedContext,
): ToolDefinition {
  return defineTool({
    name: "set_state_style",
    label: "Set State Style",
    description:
      'Style an interaction state of a node: "make the hover state blue", "gray out the disabled button", "give focus a ring". Name the state (hover, focus, active, disabled, selected, checked, error, dragged, activated, or a workspace custom state) and the properties to set on it. It writes the node\'s source variant, since states live on variants, not instances. Values may be loose, like set_properties.',
    parameters: Type.Object({
      target: Type.Union([Type.Literal("selection"), Type.Object({ nodeId: Type.String() })], {
        description: '"selection" for the selected node, or { "nodeId" } from the context.',
      }),
      state: Type.String({
        description:
          'The interaction state to style, for example "hover", "disabled", "pressed", or a custom-state name.',
      }),
      properties: Type.Record(Type.String(), Type.Unknown(), {
        description: "Property edits to apply on that state, in the same shape as set_properties.",
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

      const choices = customStateChoices(state.workspace)
      const resolvedState = resolveStateName(params.state, choices)

      if (!resolvedState) {
        const reserved = listReservedStateNames().join(", ")
        const custom =
          choices.length > 0
            ? ` Registered custom states: ${choices.map((c) => c.key).join(", ")}.`
            : " No custom states are registered; add one with add_custom_state first."

        return textResult(
          `Unknown interaction state "${params.state}". Use a reserved state (${reserved}) or a workspace custom state.${custom}`,
        )
      }

      // States are authored on variants; an instance inherits its source's
      // states. Retarget to the source so the write is never a blocked no-op.
      const writeNodeId = getSourceNodeId(state.workspace, resolution.nodeId)

      const outcome = commit(state, {
        type: "set_node_state_properties",
        payload: {
          nodeId: writeNodeId,
          state: resolvedState.key,
          properties: params.properties,
        },
      } as WorkspaceAction)

      const note =
        writeNodeId === resolution.nodeId
          ? `Styled the "${resolvedState.key}" state of ${writeNodeId}.`
          : `Styled the "${resolvedState.key}" state on the source variant ${writeNodeId}; every instance of it follows.`

      return textResult(`${outcome}\n${note}`)
    },
  })
}
