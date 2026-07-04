import { current, isDraft, produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"
import { fontCollectionBoardKeyFromEntryId } from "../../../helpers/font-collections/font-collection-id"
import { formatEntryId } from "../../../helpers/general/entry-id"
import { getNextVariantLabel } from "../../../helpers/general/get-next-variant-label"
import type { EntryFontCollection } from "../../../model/entry-font-collection"
import { formatFontCollectionLink } from "../../../model/template-ref"
import { randomSuffix } from "../shared/random-suffix"

/**
 * Clones a `font-collections` entry, points its template at the source, and appends it
 * to the owning font collection board. Duplicating the default entry creates the first variant.
 */
export function duplicateFontCollection(
  payload: ExtractPayload<"duplicate_font_collection">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const draftEntry = draft["font-collections"][payload.fontCollectionId] as
      | EntryFontCollection
      | undefined
    if (!draftEntry) return

    const entry = (
      isDraft(draftEntry) ? current(draftEntry) : draftEntry
    ) as EntryFontCollection

    const boardKey = fontCollectionBoardKeyFromEntryId(payload.fontCollectionId)
    if (!boardKey) return

    const newId =
      payload.newFontCollectionId ??
      formatEntryId("font-collection", boardKey, randomSuffix())

    if (draft["font-collections"][newId]) return

    const board = draft.boards[boardKey]
    const isFontCollectionBoard = board?.type === "font-collection"

    const base = isFontCollectionBoard ? board.label : entry.label
    const existing = new Set<string>()
    if (isFontCollectionBoard && board.variants) {
      for (const ref of board.variants) {
        const existingLabel = draft["font-collections"][ref.id]?.label
        if (existingLabel) existing.add(existingLabel)
      }
    }

    const clone: EntryFontCollection = {
      ...entry,
      id: newId,
      type: "variant",
      label: getNextVariantLabel(base, existing),
      template: formatFontCollectionLink(payload.fontCollectionId),
      overrides: structuredClone(
        entry.overrides,
      ) as EntryFontCollection["overrides"],
    }

    draft["font-collections"][newId] = clone

    if (isFontCollectionBoard && board.variants) {
      board.variants.push({ id: newId })
    }
  })
}
