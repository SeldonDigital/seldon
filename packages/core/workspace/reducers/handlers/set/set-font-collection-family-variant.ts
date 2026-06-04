import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../../index"
import type { EntryFontCollection } from "../../../model/entry-font-collection"
import { setFamilyVariant } from "../shared/font-collection-variant-selection"

/**
 * Enables or disables one variant (weight or style) of a family on a font
 * collection entry, stored under `overrides.variantSelection[slot][variant]`.
 */
export function setFontCollectionFamilyVariant(
  payload: ExtractPayload<"set_font_collection_family_variant">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft["font-collections"][payload.fontCollectionId] as
      | EntryFontCollection
      | undefined
    if (!entry) return
    setFamilyVariant(entry, payload.slot, payload.variant, payload.enabled)
  })
}
