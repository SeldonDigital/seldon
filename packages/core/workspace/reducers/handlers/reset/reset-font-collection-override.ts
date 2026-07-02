import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { deleteOverrideAtPath } from "../../../helpers/general/override-paths"
import {
  WORKSPACE_EDITABLE_FONT_COLLECTION_ENTRY_ID,
  ensureWorkspaceEditableFontCollectionEntry,
} from "../../../helpers/font-collections/workspace-editable-font-collection"
import type { EntryFontCollection } from "../../../model/entry-font-collection"

/** Removes one dot-path from `overrides` on a `font-collections` entry. */
export function resetFontCollectionOverride(
  payload: ExtractPayload<"reset_font_collection_override">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    if (
      payload.fontCollectionId === WORKSPACE_EDITABLE_FONT_COLLECTION_ENTRY_ID
    ) {
      ensureWorkspaceEditableFontCollectionEntry(draft)
    }
    const entry = draft["font-collections"][payload.fontCollectionId] as
      | EntryFontCollection
      | undefined
    if (!entry) return
    const overrides: Record<string, unknown> = {
      ...(entry.overrides as Record<string, unknown>),
    }
    deleteOverrideAtPath(overrides, payload.path)
    entry.overrides = overrides
  })
}
