import { produce } from "immer"

import {
  WORKSPACE_EDITABLE_FONT_COLLECTION_ENTRY_ID,
  ensureWorkspaceEditableFontCollectionEntry,
} from "../../../helpers/font-collections/workspace-editable-font-collection"

import type { ExtractPayload, Workspace } from "../../../../index"

/** Sets `workspace["font-collections"][fontCollectionId].label`. */
export function setFontCollectionLabel(
  payload: ExtractPayload<"set_font_collection_label">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    if (payload.fontCollectionId === WORKSPACE_EDITABLE_FONT_COLLECTION_ENTRY_ID) {
      ensureWorkspaceEditableFontCollectionEntry(draft)
    }

    const entry = draft["font-collections"][payload.fontCollectionId]

    if (!entry) return
    entry.label = payload.label
  })
}
