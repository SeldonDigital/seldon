import type { WorkspaceAction } from "../../reducers/types"

export type LooseWireAction = { type: string; payload?: Record<string, unknown> }

const SKIP_TYPES = new Set<string>([
  "ai_return_searched_components",
  "ai_transcript_add_message",
])

const EXPLICIT_TYPE_MAP: Record<string, WorkspaceAction["type"]> = {
  ai_add_component: "add_component",
  ai_remove_component: "remove_component",
  ai_add_icon_set_board: "add_icon_set",
  ai_add_theme_board: "add_theme",
  ai_add_assembly_board: "add_playground",
  ai_insert_node: "insert_variant_instance",
  ai_remove_node: "remove_instance",
  ai_move_node: "move_instance",
  ai_reorder_node: "reorder_instance_in_parent",
  ai_duplicate_node: "duplicate_node",
  ai_add_variant: "add_variant",
  ai_set_board_properties: "set_component_properties",
  ai_set_board_theme: "set_component_theme",
}

/**
 * Maps legacy `ai_*` wire payloads into {@link WorkspaceAction}.
 * Call at API or editor boundaries; {@link workspaceReducer} only accepts unified actions.
 */
export function normalizeWireActionToWorkspaceAction(
  raw: LooseWireAction,
): WorkspaceAction | null {
  const { type, payload = {} } = raw
  if (SKIP_TYPES.has(type)) return null
  if (!type.startsWith("ai_")) {
    return raw as WorkspaceAction
  }

  const mappedType = EXPLICIT_TYPE_MAP[type] ?? (type.slice(3) as WorkspaceAction["type"])

  switch (type) {
    case "ai_add_icon_set_board":
      return {
        type: mappedType,
        payload: { catalogId: String(payload.componentId ?? "") },
      } as WorkspaceAction

    case "ai_add_theme_board":
      return {
        type: mappedType,
        payload: { boardKey: String(payload.boardKey ?? payload.componentId ?? "") },
      } as WorkspaceAction

    case "ai_add_assembly_board":
      return {
        type: mappedType,
        payload: { boardKey: String(payload.boardKey ?? payload.componentId ?? "") },
      } as WorkspaceAction

    case "ai_insert_node":
      return {
        type: mappedType,
        payload: {
          variantId: payload.nodeId,
          target: payload.target,
        },
      } as WorkspaceAction

    case "ai_remove_node":
      return {
        type: mappedType,
        payload: { instanceId: payload.nodeId },
      } as WorkspaceAction

    case "ai_move_node":
      return {
        type: mappedType,
        payload: {
          instanceId: payload.nodeId,
          target: payload.target,
        },
      } as WorkspaceAction

    case "ai_reorder_node":
      return {
        type: mappedType,
        payload: {
          instanceId: payload.nodeId,
          newIndex: payload.newIndex,
        },
      } as WorkspaceAction

    case "ai_duplicate_node":
      return {
        type: mappedType,
        payload: { nodeId: payload.nodeId },
      } as WorkspaceAction

    case "ai_add_variant":
      return {
        type: mappedType,
        payload: {
          boardKey: payload.componentId,
          properties: payload.properties,
          ensureDescendantComponents: true,
        },
      } as WorkspaceAction

    case "ai_set_board_properties":
      return {
        type: mappedType,
        payload: {
          boardKey: payload.boardKey ?? payload.componentId,
          properties: payload.properties,
        },
      } as WorkspaceAction

    case "ai_set_board_theme":
      return {
        type: mappedType,
        payload: {
          boardKey: payload.boardKey ?? payload.componentId,
          theme: payload.theme,
        },
      } as WorkspaceAction

    default:
      return { type: mappedType, payload } as WorkspaceAction
  }
}
