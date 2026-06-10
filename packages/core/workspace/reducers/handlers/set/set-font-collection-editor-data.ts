import { produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"
import {
  WORKSPACE_EDITABLE_FONT_COLLECTION_ENTRY_ID,
  ensureWorkspaceEditableFontCollectionEntry,
} from "../../../helpers/font-collections/workspace-editable-font-collection"

/** Sets or clears `workspace["font-collections"][fontCollectionId].__editor`. */
export function setFontCollectionEditorData(
  payload: ExtractPayload<"set_font_collection_editor_data">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    if (
      payload.fontCollectionId === WORKSPACE_EDITABLE_FONT_COLLECTION_ENTRY_ID
    ) {
      ensureWorkspaceEditableFontCollectionEntry(draft)
    }
    const entry = draft["font-collections"][payload.fontCollectionId]
    if (!entry) return
    if (payload.editorData === undefined) delete entry.__editor
    else entry.__editor = payload.editorData
  })
}
