import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import type { EntryFontCollection } from "../../../model/entry-font-collection"

/** Clears every override on one `font-collections` entry. */
export function resetFontCollection(
  payload: ExtractPayload<"reset_font_collection">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft["font-collections"][payload.fontCollectionId] as
      | EntryFontCollection
      | undefined
    if (!entry) return
    entry.overrides = {}
  })
}
