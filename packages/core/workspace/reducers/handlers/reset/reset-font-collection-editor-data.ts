import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../../index"
import {
  WORKSPACE_EDITABLE_FONT_COLLECTION_ENTRY_ID,
  ensureWorkspaceEditableFontCollectionEntry,
} from "../../../helpers/font-collections/workspace-editable-font-collection"
import type { EntryFontCollection } from "../../../model/entry-font-collection"

/** Drops editor-only metadata on one `font-collections` entry. */
export function resetFontCollectionEditorData(
  payload: ExtractPayload<"reset_font_collection_editor_data">,
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
    delete entry.__editor
  })
}
