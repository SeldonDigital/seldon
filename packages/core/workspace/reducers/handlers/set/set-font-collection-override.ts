import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import {
  deleteFontCollectionOverrideAtPath,
  setFontCollectionOverrideAtPath,
} from "../../../helpers/font-collections/font-collection-id"
import {
  WORKSPACE_EDITABLE_FONT_COLLECTION_ENTRY_ID,
  ensureWorkspaceEditableFontCollectionEntry,
} from "../../../helpers/font-collections/workspace-editable-font-collection"
import type { EntryFontCollection } from "../../../model/entry-font-collection"

/**
 * Writes `payload.value` into `workspace["font-collections"][fontCollectionId].overrides` at
 * `payload.path`. Use `null` as the value to remove that entry.
 */
export function setFontCollectionOverride(
  payload: ExtractPayload<"set_font_collection_override">,
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
    if (payload.value === null) {
      deleteFontCollectionOverrideAtPath(overrides, payload.path)
    } else {
      setFontCollectionOverrideAtPath(overrides, payload.path, payload.value)
    }
    entry.overrides = overrides
  })
}
