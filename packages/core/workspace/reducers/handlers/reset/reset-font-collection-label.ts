import { produce } from "immer"
import { STOCK_FONT_COLLECTIONS_BY_ID } from "../../../../font-collections/catalog"
import type { FontCollectionTemplateId } from "../../../../font-collections/types"
import { ExtractPayload, Workspace } from "../../../../index"
import { getFontCollectionTemplateCatalogId } from "../../../model/template-ref"
import {
  WORKSPACE_EDITABLE_FONT_COLLECTION_ENTRY_ID,
  ensureWorkspaceEditableFontCollectionEntry,
} from "../../../helpers/font-collections/workspace-editable-font-collection"
import type { EntryFontCollection } from "../../../model/entry-font-collection"
import { isEntryFontCollectionDefault } from "../../../model/entry-font-collection"

/** Restores `label` on one `font-collections` entry to the catalog-aligned default. */
export function resetFontCollectionLabel(
  payload: ExtractPayload<"reset_font_collection_label">,
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

    if (isEntryFontCollectionDefault(entry)) {
      const catalogId = getFontCollectionTemplateCatalogId(entry.template)
      const stock = catalogId
        ? STOCK_FONT_COLLECTIONS_BY_ID[catalogId as FontCollectionTemplateId]
        : undefined
      if (stock) entry.label = "Default"
    }
  })
}
