import type { EntryFontCollection } from "../../model/entry-font-collection"
import {
  DEFAULT_FONT_COLLECTION_ENTRY_ID,
  createDefaultFontCollectionEntry,
} from "../seed/seed-default-font-collection-board"

/** Font collection row id for the editor-editable default System collection. */
export const WORKSPACE_EDITABLE_FONT_COLLECTION_ENTRY_ID =
  DEFAULT_FONT_COLLECTION_ENTRY_ID

export function ensureWorkspaceEditableFontCollectionEntry(workspace: {
  "font-collections"?: Record<string, EntryFontCollection>
}): void {
  if (!workspace["font-collections"]) {
    workspace["font-collections"] = {}
  }
  if (
    !workspace["font-collections"][WORKSPACE_EDITABLE_FONT_COLLECTION_ENTRY_ID]
  ) {
    workspace["font-collections"][WORKSPACE_EDITABLE_FONT_COLLECTION_ENTRY_ID] =
      createDefaultFontCollectionEntry()
  }
}
