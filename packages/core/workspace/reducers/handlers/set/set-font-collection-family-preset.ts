import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../../index"
import type { EntryFontCollection } from "../../../model/entry-font-collection"
import { workspaceFontCollectionService } from "../../../services"
import { setFamilyVariantPreset } from "../shared/font-collection-variant-selection"

/**
 * Applies a preset to a family on a font collection entry. `all` clears the
 * slot override so every variant defaults to enabled; `none` disables every
 * available variant.
 */
export function setFontCollectionFamilyPreset(
  payload: ExtractPayload<"set_font_collection_family_preset">,
  workspace: Workspace,
): Workspace {
  const collection = workspaceFontCollectionService.getFontCollection(
    payload.fontCollectionId,
    workspace,
  )
  const available = collection?.families?.[payload.slot]?.variants ?? []

  return produce(workspace, (draft) => {
    const entry = draft["font-collections"][payload.fontCollectionId] as
      | EntryFontCollection
      | undefined
    if (!entry) return
    setFamilyVariantPreset(entry, payload.slot, payload.preset, available)
  })
}
