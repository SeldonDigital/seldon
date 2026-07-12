import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { getSourceNodeId } from "@seldon/core/workspace/helpers/components/get-source-node-id"
import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

import { normalizeActions } from "../../repair/normalize-actions"
import { ALL_ACTION_TYPES } from "../../schema/action-schema"
import type { ResolvedContext } from "../editor-context"
import { type TargetSpec, resolveNodeTarget } from "./resolve-target"
import type { PiTurnState } from "./turn-state"

const KNOWN_ACTION_TYPES = new Set(ALL_ACTION_TYPES)

function textResult(text: string) {
  return { content: [{ type: "text" as const, text }], details: {} }
}

/** True when applying an action left the working copy effectively unchanged. */
function isUnchanged(before: unknown, after: unknown): boolean {
  if (before === after) return true
  return JSON.stringify(before) === JSON.stringify(after)
}

/**
 * Validates one proposed action against the turn's working copy and records it.
 * Runs the deterministic shape repair, then dry-runs the action through the
 * reducer. A reducer rejection throws so Pi feeds the exact reason back to the
 * model as a tool error, which is how the model self-corrects. A validated
 * action that changes nothing is reported without recording it, so the model can
 * retarget instead of the caller applying a no-op.
 */
function commit(state: PiTurnState, rawAction: WorkspaceAction): string {
  const { actions: normalized, repairs } = normalizeActions([rawAction])
  const next = applyActions(state.workspace, normalized)
  if (isUnchanged(state.workspace, next)) {
    return `Action "${rawAction.type}" validated but changed nothing. It likely matched no node or set a value already in place. Check the target id and try a different edit.`
  }
  state.workspace = next
  state.actions.push(...normalized)
  state.repairs.push(...repairs)
  return `Applied ${rawAction.type}.`
}

/**
 * The Seldon mutation tools for one turn. Each tool proposes one or more
 * `WorkspaceAction`s validated against the shared working copy. Typed tools
 * cover the common single-action payloads; `apply_actions` batches many edits in
 * one call and is the escape hatch for the long tail of action types, so the
 * model spends fewer round-trips and is never blocked on an action that lacks a
 * typed wrapper.
 */
export function createMutationTools(
  state: PiTurnState,
  resolved: ResolvedContext,
): ToolDefinition[] {
  const propertyValue = Type.Record(Type.String(), Type.Unknown())

  const setProperties = defineTool({
    name: "set_properties",
    label: "Set Properties",
    description:
      'The primary way to change a node\'s properties. Give a target, a scope, and the properties to set. target is "selection" for the node the user has selected, or { "nodeId" } for a specific node from the context. scope "instance" overrides just that node; scope "all" edits the component source so every instance without its own override follows. Values may be written loosely: a bare string or number becomes an exact value, and an "@scope.key" string becomes a theme reference. Pass an optional "match" (a label or catalog id) so the tool can find the node if the target is not in the current scope.',
    parameters: Type.Object({
      target: Type.Union(
        [Type.Literal("selection"), Type.Object({ nodeId: Type.String() })],
        {
          description:
            '"selection" for the selected node, or { "nodeId": "..." } for a node id from the context.',
        },
      ),
      scope: Type.Optional(
        Type.Union([Type.Literal("instance"), Type.Literal("all")], {
          description:
            'Default "instance". Use "all" only for an explicit "all/every" request; it edits the component source.',
        }),
      ),
      properties: propertyValue,
      match: Type.Optional(
        Type.String({
          description:
            "A label or catalog id to locate the node when the target is not in scope.",
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
      )
      if (resolution.kind === "message") return textResult(resolution.text)

      const scope = params.scope ?? "instance"
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

  const setNodeProperties = defineTool({
    name: "set_node_properties",
    label: "Set Node Properties",
    description:
      "Set one or more properties on a node by its id. Use tagged property values as described in the system prompt.",
    parameters: Type.Object({
      nodeId: Type.String({
        description: "Existing node id from the context.",
      }),
      properties: propertyValue,
    }),
    execute: async (_id, params) =>
      textResult(
        commit(state, {
          type: "set_node_properties",
          payload: { nodeId: params.nodeId, properties: params.properties },
        } as WorkspaceAction),
      ),
  })

  const setComponentProperties = defineTool({
    name: "set_component_properties",
    label: "Set Component Properties",
    description:
      "Set one or more properties on a component board's default, by board key.",
    parameters: Type.Object({
      boardKey: Type.String({ description: "Board key from the context." }),
      properties: propertyValue,
    }),
    execute: async (_id, params) =>
      textResult(
        commit(state, {
          type: "set_component_properties",
          payload: { boardKey: params.boardKey, properties: params.properties },
        } as WorkspaceAction),
      ),
  })

  const addComponent = defineTool({
    name: "add_component",
    label: "Add Component",
    description:
      "Add a component instance from the catalog under an existing parent node. Only nest what the hierarchy allows.",
    parameters: Type.Object({
      boardKey: Type.String({
        description: "Catalog id of the component to add.",
      }),
      parentId: Type.String({ description: "Existing parent node id." }),
      index: Type.Optional(
        Type.Number({
          description: "Insertion index among the parent's children.",
        }),
      ),
    }),
    execute: async (_id, params) =>
      textResult(
        commit(state, {
          type: "add_component_and_insert_default_instance",
          payload: {
            boardKey: params.boardKey,
            target: { parentId: params.parentId, index: params.index },
          },
        } as WorkspaceAction),
      ),
  })

  const insertVariantInstance = defineTool({
    name: "insert_variant_instance",
    label: "Insert Variant Instance",
    description:
      "Insert an instance of a variant under an existing parent node.",
    parameters: Type.Object({
      variantId: Type.String({
        description: "Variant node id from the context.",
      }),
      parentId: Type.String({ description: "Existing parent node id." }),
      index: Type.Optional(
        Type.Number({
          description: "Insertion index among the parent's children.",
        }),
      ),
    }),
    execute: async (_id, params) =>
      textResult(
        commit(state, {
          type: "insert_variant_instance",
          payload: {
            variantId: params.variantId,
            target: { parentId: params.parentId, index: params.index },
          },
        } as WorkspaceAction),
      ),
  })

  const removeInstance = defineTool({
    name: "remove_instance",
    label: "Remove Instance",
    description: "Remove an instance node by its id.",
    parameters: Type.Object({
      instanceId: Type.String({
        description: "Instance node id from the context.",
      }),
    }),
    execute: async (_id, params) =>
      textResult(
        commit(state, {
          type: "remove_instance",
          payload: { instanceId: params.instanceId },
        } as WorkspaceAction),
      ),
  })

  const setThemeOverride = defineTool({
    name: "set_theme_override",
    label: "Set Theme Override",
    description:
      "Override a single theme token by path on an existing theme. Pass null to reset the token.",
    parameters: Type.Object({
      themeId: Type.String({ description: "Theme id from the context." }),
      path: Type.String({
        description: "Token path, for example swatch.primary.",
      }),
      value: Type.Optional(Type.Unknown()),
    }),
    execute: async (_id, params) =>
      textResult(
        commit(state, {
          type: "set_theme_override",
          payload: {
            themeId: params.themeId,
            path: params.path,
            value: params.value ?? null,
          },
        } as WorkspaceAction),
      ),
  })

  const setBoardLabel = defineTool({
    name: "set_board_label",
    label: "Set Board Label",
    description: "Rename a board by its key.",
    parameters: Type.Object({
      boardKey: Type.String({ description: "Board key from the context." }),
      label: Type.String({ description: "New board label." }),
    }),
    execute: async (_id, params) =>
      textResult(
        commit(state, {
          type: "set_board_label",
          payload: { boardKey: params.boardKey, label: params.label },
        } as WorkspaceAction),
      ),
  })

  const applyActionsTool = defineTool({
    name: "apply_actions",
    label: "Apply Actions",
    description:
      'Apply one or more workspace actions in a single call, in order, against the working copy. Prefer this over calling tools repeatedly: put every edit for the request in one call. It is also the escape hatch for any action without a dedicated tool. Each item is { "type", "payload" }, where "type" is an allowed action type and "payload" matches that action\'s shape. Actions run top to bottom, so create a node before setting its properties. Call get_action_spec when unsure of an action\'s payload keys. Each action is reported on its own line; resend only the ones marked "rejected".',
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

  return [
    setProperties,
    setNodeProperties,
    setComponentProperties,
    addComponent,
    insertVariantInstance,
    removeInstance,
    setThemeOverride,
    setBoardLabel,
    applyActionsTool,
  ]
}
