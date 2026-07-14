import type { WorkspaceAction } from "@seldon/core/workspace/types"

/**
 * Action-exposure classification for the MCP `apply_actions` whitelist.
 *
 * Every Core action type is classified as one of:
 *
 * - `"exposed"`  — accepted by `apply_actions` in v1. Exactly the 24 whitelisted
 *   logical actions; the 18 `add_theme_custom_*` variants are exposed as-is and
 *   count as the single logical `add_theme_custom_token` entry.
 * - `"tier2"`    — valid Core action, not exposed in v1. Rejected with a
 *   "not exposed in v1" teaching error. Promotion to `"exposed"` is a one-line
 *   change here, driven by the observability evidence stream.
 * - `"excluded"` — never exposed through the MCP. Editor bookkeeping, reserved
 *   stubs, credential/ownership writes, and internal transport actions.
 *
 * The `satisfies Record<WorkspaceAction["type"], …>` check is the
 * compiler gate: adding an action type to Core's union makes this file — and
 * therefore the MCP build — fail until the new action is deliberately
 * classified. Removing or renaming a Core action fails the same way via the
 * excess-key check.
 */
export type ActionExposure = "exposed" | "tier2" | "excluded"

export type WorkspaceActionType = WorkspaceAction["type"]

export const ACTION_EXPOSURE = {
  // ── Exposed: Structure (10) ────────────────────────────────────────────────
  add_component: "exposed",
  add_component_and_insert_default_instance: "exposed",
  remove_component: "exposed",
  add_variant: "exposed",
  insert_default_instance: "exposed",
  insert_variant_instance: "exposed",
  remove_instance: "exposed",
  move_instance: "exposed",
  reorder_instance_in_parent: "exposed",
  duplicate_node: "exposed",

  // ── Exposed: Styling (5) ───────────────────────────────────────────────────
  set_node_properties: "exposed",
  reset_node_property: "exposed",
  set_node_label: "exposed",
  add_node_layer: "exposed",
  set_node_state_properties: "exposed",

  // ── Exposed: Theming (5 logical; the 18 custom-token actions = 1 entry) ───
  add_theme: "exposed",
  set_theme_override: "exposed",
  set_component_theme: "exposed",
  set_node_theme: "exposed",
  add_theme_custom_swatch: "exposed",
  add_theme_custom_font: "exposed",
  add_theme_custom_border: "exposed",
  add_theme_custom_gradient: "exposed",
  add_theme_custom_shadow: "exposed",
  add_theme_custom_scrollbar: "exposed",
  add_theme_custom_size: "exposed",
  add_theme_custom_dimension: "exposed",
  add_theme_custom_margin: "exposed",
  add_theme_custom_padding: "exposed",
  add_theme_custom_gap: "exposed",
  add_theme_custom_corners: "exposed",
  add_theme_custom_borderWidth: "exposed",
  add_theme_custom_blur: "exposed",
  add_theme_custom_spread: "exposed",
  add_theme_custom_fontSize: "exposed",
  add_theme_custom_fontWeight: "exposed",
  add_theme_custom_lineHeight: "exposed",

  // ── Exposed: Recovery (3) ──────────────────────────────────────────────────
  reset_node: "exposed",
  reset_instance_to_source: "exposed",
  reset_component_to_catalog: "exposed",

  // ── Exposed: Workflow (1) ──────────────────────────────────────────────────
  add_sandbox: "exposed",

  // ── Excluded permanently ───────────────────────────────────────────────────
  // Editor bookkeeping: never meaningful to a headless agent.
  set_board_editor_data: "excluded",
  reset_board_editor_data: "excluded",
  set_node_editor_data: "excluded",
  reset_node_editor_data: "excluded",
  set_theme_editor_data: "excluded",
  reset_theme_editor_data: "excluded",
  set_font_collection_editor_data: "excluded",
  reset_font_collection_editor_data: "excluded",
  // Reserved no-ops until Core's specs land.
  stubs_add_font_collection_row: "excluded",
  stubs_remove_font_collection_row: "excluded",
  stubs_set_font_collection_field: "excluded",
  stubs_duplicate_font_collection_row: "excluded",
  stubs_add_media_row: "excluded",
  stubs_remove_media_row: "excluded",
  stubs_set_media_field: "excluded",
  stubs_duplicate_media_row: "excluded",
  // Deprecated no-op narration channel.
  transcript_add_message: "excluded",
  // Credentials and ownership are user territory, never model territory.
  set_board_credentials: "excluded",
  set_workspace_owner: "excluded",

  // ── Excluded beyond the permanent list (deliberate extensions, same rationale)
  // Whole-file replace is the internal transport of `workspace_open`; exposing
  // it through `apply_actions` would bypass every batch/receipt/redaction rail.
  set_workspace: "excluded",
  // Symmetric with the excluded setters above: the credential/ownership
  // surface stays at zero in both directions.
  reset_board_credentials: "excluded",
  reset_workspace_owner: "excluded",

  // ── Tier 2: workspace metadata ─────────────────────────────────────────────
  set_workspace_label: "tier2",
  set_workspace_version: "tier2",
  set_workspace_last_update: "tier2",
  set_workspace_intent: "tier2",
  set_workspace_tags: "tier2",
  set_workspace_license: "tier2",
  reset_workspace_label: "tier2",
  normalize_metadata_version: "tier2",
  reset_workspace_last_update: "tier2",
  reset_workspace_intent: "tier2",
  reset_workspace_tags: "tier2",
  reset_workspace_license: "tier2",

  // ── Tier 2: board / playground management ──────────────────────────────────
  add_playground: "tier2",
  remove_playground: "tier2",
  duplicate_component: "tier2",
  duplicate_playground: "tier2",
  reorder_board: "tier2",
  reorder_variant_in_board: "tier2",
  set_board_label: "tier2",
  set_playground_label: "tier2",
  set_board_intent: "tier2",
  set_board_tags: "tier2",
  set_board_license: "tier2",
  set_board_author: "tier2",
  set_board_preview: "tier2",
  reset_board_label: "tier2",
  reset_board_intent: "tier2",
  reset_board_tags: "tier2",
  reset_board_license: "tier2",
  reset_board_author: "tier2",
  reset_board_preview: "tier2",
  set_component_properties: "tier2",
  reset_component_property: "tier2",
  apply_component_properties_to_all_boards: "tier2",

  // ── Tier 2: node mutations ─────────────────────────────────────────────────
  insert_duplicate_instance: "tier2",
  remove_variant: "tier2",
  move_instance_directional: "tier2",
  set_node_ref: "tier2",
  set_node_repeat: "tier2",
  reset_node_label: "tier2",
  reset_node_state_property: "tier2",
  reset_node_state: "tier2",
  add_custom_state: "tier2",
  remove_custom_state: "tier2",
  rename_custom_state: "tier2",
  remove_node_layer: "tier2",
  reorder_node_layer: "tier2",
  set_node_layer_kind: "tier2",
  reset_variant_to_catalog: "tier2",
  reset_variant_instances: "tier2",
  reset_instance_to_original: "tier2",
  reset_default_variant_to_catalog: "tier2",

  // ── Tier 2: theming ────────────────────────────────────────────────────────
  set_theme_label: "tier2",
  set_theme_scale_slot: "tier2",
  set_theme_custom_token_name: "tier2",
  reset_theme_tokens: "tier2",
  reset_theme_label: "tier2",
  reset_theme_override: "tier2",
  remove_theme: "tier2",
  delete_theme: "tier2",
  duplicate_theme: "tier2",
  remove_theme_custom_swatch: "tier2",
  remove_theme_custom_font: "tier2",
  remove_theme_custom_border: "tier2",
  remove_theme_custom_background: "tier2",
  remove_theme_custom_gradient: "tier2",
  remove_theme_custom_shadow: "tier2",
  remove_theme_custom_scrollbar: "tier2",
  remove_theme_custom_size: "tier2",
  remove_theme_custom_dimension: "tier2",
  remove_theme_custom_margin: "tier2",
  remove_theme_custom_padding: "tier2",
  remove_theme_custom_gap: "tier2",
  remove_theme_custom_corners: "tier2",
  remove_theme_custom_borderWidth: "tier2",
  remove_theme_custom_blur: "tier2",
  remove_theme_custom_spread: "tier2",
  remove_theme_custom_fontSize: "tier2",
  remove_theme_custom_fontWeight: "tier2",
  remove_theme_custom_lineHeight: "tier2",

  // ── Tier 2: font collections (the predicted first exposure gap) ────────────
  add_font_collection: "tier2",
  remove_font_collection: "tier2",
  set_font_collection_label: "tier2",
  set_font_collection_override: "tier2",
  set_font_collection_family_variant: "tier2",
  set_font_collection_family_preset: "tier2",
  reset_font_collection_label: "tier2",
  reset_font_collection_override: "tier2",
  reset_font_collection: "tier2",
  delete_font_collection: "tier2",
  duplicate_font_collection: "tier2",
  add_font_collection_custom_family: "tier2",
  remove_font_collection_custom_family: "tier2",

  // ── Tier 2: icon sets ──────────────────────────────────────────────────────
  add_icon_set: "tier2",
  remove_icon_set: "tier2",
  set_icon_set_label: "tier2",
  set_icon_set_override: "tier2",
  reset_icon_set_override: "tier2",
  reset_icon_set: "tier2",
  set_icon_set_subcategory_preset: "tier2",
  delete_icon_set: "tier2",
  duplicate_icon_set: "tier2",

  // ── Tier 2: media (Core spec is stubbed) ───────────────────────────────────
  add_media: "tier2",
  remove_media: "tier2",
} as const satisfies Record<WorkspaceActionType, ActionExposure>

/** Action types accepted by `apply_actions` in v1, derived from the classification. */
export type ExposedActionType = {
  [K in WorkspaceActionType]: (typeof ACTION_EXPOSURE)[K] extends "exposed"
    ? K
    : never
}[WorkspaceActionType]

/** Runtime list of the exposed action types, in classification order. */
export const EXPOSED_ACTION_TYPES = (
  Object.keys(ACTION_EXPOSURE) as WorkspaceActionType[]
).filter(
  (type): type is ExposedActionType => ACTION_EXPOSURE[type] === "exposed",
)

/** Tells whether an action type is accepted by `apply_actions` in v1. */
export function isExposedActionType(
  type: WorkspaceActionType,
): type is ExposedActionType {
  return ACTION_EXPOSURE[type] === "exposed"
}

/**
 * The canonical explanation for why an action type is not accepted by
 * `apply_actions`. Single source of the classification wording —
 * `apply_actions` and `get_action_schema` both surface it verbatim.
 */
export function explainExposure(
  type: string,
):
  | { exposed: true }
  | {
      exposed: false
      classification: "unknown" | "tier2" | "excluded"
      message: string
    } {
  const exposure = ACTION_EXPOSURE[type as WorkspaceActionType] as
    | ActionExposure
    | undefined
  if (exposure === "exposed") return { exposed: true }
  const classification = exposure ?? "unknown"
  const message =
    classification === "unknown"
      ? `"${type}" is not a Core action type.`
      : classification === "tier2"
        ? `"${type}" is a valid Core action but is not exposed in v1.`
        : `"${type}" is never exposed through the MCP.`
  return { exposed: false, classification, message }
}
