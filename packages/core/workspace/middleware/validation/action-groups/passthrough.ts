import type { Action } from "../../../types"

/** Actions that need no pre-reducer validation. */
export const PASSTHROUGH_ACTION_TYPES = new Set<Action["type"]>([
  "set_workspace",
  "set_workspace_owner",
  "set_workspace_label",
  "set_workspace_version",
  "set_workspace_last_update",
  "set_workspace_intent",
  "set_workspace_tags",
  "set_workspace_license",
  "reset_workspace_owner",
  "reset_workspace_label",
  "normalize_metadata_version",
  "reset_workspace_last_update",
  "reset_workspace_intent",
  "reset_workspace_tags",
  "reset_workspace_license",
  "transcript_add_message",
  "stubs_add_font_collection_row",
  "stubs_remove_font_collection_row",
  "stubs_set_font_collection_field",
  "stubs_duplicate_font_collection_row",
  "stubs_add_media_row",
  "stubs_remove_media_row",
  "stubs_set_media_field",
  "stubs_duplicate_media_row",
])

export function isPassthroughAction(type: Action["type"]): boolean {
  return PASSTHROUGH_ACTION_TYPES.has(type)
}
