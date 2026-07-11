import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

import { normalizeActions } from "../../repair/normalize-actions"
import {
  ALL_ACTION_TYPES,
  buildActionPayloadSpecs,
} from "../../schema/action-schema"
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
 * The Seldon mutation tools for one turn. Each tool proposes a `WorkspaceAction`
 * validated against the shared working copy. Typed tools cover the common
 * payloads; `apply_action` is the escape hatch for the long tail of action types
 * so the model is never blocked on an action that lacks a typed wrapper.
 */
export function createMutationTools(state: PiTurnState): ToolDefinition[] {
  const propertyValue = Type.Record(Type.String(), Type.Unknown())

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

  const applyAction = defineTool({
    name: "apply_action",
    label: "Apply Action",
    description: `Escape hatch for any workspace action without a dedicated tool. Prefer a dedicated tool when one exists. "type" must be one of the allowed action types; "payload" must match that action's shape.\n${buildActionPayloadSpecs(
      ALL_ACTION_TYPES,
    ).join("\n")}`,
    parameters: Type.Object({
      type: Type.String({ description: "One of the allowed action types." }),
      payload: Type.Record(Type.String(), Type.Unknown()),
    }),
    execute: async (_id, params) => {
      if (!KNOWN_ACTION_TYPES.has(params.type)) {
        throw new Error(
          `Unknown action type "${params.type}". Allowed types: ${ALL_ACTION_TYPES.join(", ")}.`,
        )
      }
      return textResult(
        commit(state, {
          type: params.type,
          payload: params.payload,
        } as WorkspaceAction),
      )
    },
  })

  return [
    setNodeProperties,
    setComponentProperties,
    addComponent,
    insertVariantInstance,
    removeInstance,
    setThemeOverride,
    setBoardLabel,
    applyAction,
  ]
}
