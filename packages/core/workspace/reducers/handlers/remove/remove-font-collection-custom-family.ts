import { produce } from "immer"

import { isEntryFontCollectionDefault } from "../../../model/entry-font-collection"
import { removeCustomFamily } from "../shared/font-collection-custom-family"

import type { ExtractPayload, Workspace } from "../../../../index"

/**
 * Deletes a custom family slot from a variant `font-collections` entry's `overrides.families` bag.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function removeFontCollectionCustomFamily(
  payload: ExtractPayload<"remove_font_collection_custom_family">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft["font-collections"][payload.fontCollectionId]

    if (!entry || isEntryFontCollectionDefault(entry)) return
    removeCustomFamily(entry, payload.key)
  })
}
