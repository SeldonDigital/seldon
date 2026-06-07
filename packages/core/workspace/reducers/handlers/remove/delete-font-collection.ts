import { produce } from "immer"
import type { ExtractPayload, Workspace } from "../../../../index"
import { fontCollectionBoardKeyFromEntryId } from "../../../helpers/font-collections/font-collection-id"
import type { EntryFontCollection } from "../../../model/entry-font-collection"
import { isEntryFontCollectionDefault } from "../../../model/entry-font-collection"

/** Deletes one variant `font-collections` entry and drops its ref from the owning board. */
export function deleteFontCollection(
  payload: ExtractPayload<"delete_font_collection">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft["font-collections"][payload.fontCollectionId] as
      | EntryFontCollection
      | undefined
    if (!entry || isEntryFontCollectionDefault(entry)) return

    delete draft["font-collections"][payload.fontCollectionId]

    const boardKey = fontCollectionBoardKeyFromEntryId(
      payload.fontCollectionId,
    )
    if (!boardKey) return
    const board = draft.components[boardKey]
    if (board?.type !== "font-collection" || !board.variants) return
    board.variants = board.variants.filter(
      (r) => r.id !== payload.fontCollectionId,
    )
  })
}
