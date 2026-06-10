import { produce } from "immer"

import type { FontFamilyEntry } from "../../../../font-collections/types"
import { ExtractPayload, Workspace } from "../../../../index"
import { isEntryFontCollectionDefault } from "../../../model/entry-font-collection"
import {
  appendCustomFamily,
  getNextCustomFamilyId,
} from "../shared/font-collection-custom-family"

/**
 * Appends a custom font family to a variant `font-collections` entry's `overrides.families` bag.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function addFontCollectionCustomFamily(
  payload: ExtractPayload<"add_font_collection_custom_family">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft["font-collections"][payload.fontCollectionId]
    if (!entry || isEntryFontCollectionDefault(entry)) return

    const id = getNextCustomFamilyId(entry)

    const family: FontFamilyEntry = {
      name: payload.name,
      origin: payload.origin ?? "remote",
      stack: payload.stack,
      variants: payload.variants,
    }

    appendCustomFamily(entry, id, family)
  })
}
