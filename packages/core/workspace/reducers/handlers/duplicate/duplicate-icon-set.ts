import { current, isDraft, produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"
import { formatEntryId } from "../../../helpers/general/entry-id"
import { getNextVariantLabel } from "../../../helpers/general/get-next-variant-label"
import { iconSetBoardKeyFromEntryId } from "../../../helpers/icon-sets/icon-set-id"
import type { EntryIconSet } from "../../../model/entry-icon-set"
import { formatIconSetLink } from "../../../model/template-ref"
import { randomSuffix } from "../shared/random-suffix"

/**
 * Clones an `icon-sets` entry, points its template at the source, and appends it
 * to the owning icon set board. Duplicating the default entry creates the first variant.
 */
export function duplicateIconSet(
  payload: ExtractPayload<"duplicate_icon_set">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const draftEntry = draft["icon-sets"][payload.iconSetId] as
      | EntryIconSet
      | undefined
    if (!draftEntry) return

    const entry = (
      isDraft(draftEntry) ? current(draftEntry) : draftEntry
    ) as EntryIconSet

    const boardKey = iconSetBoardKeyFromEntryId(payload.iconSetId)
    if (!boardKey) return

    const newId =
      payload.newIconSetId ?? formatEntryId("icon-set", boardKey, randomSuffix())

    if (draft["icon-sets"][newId]) return

    const board = draft.boards[boardKey]
    const isIconSetBoard = board?.type === "icon-set"

    const base = isIconSetBoard ? board.label : entry.label
    const existing = new Set<string>()
    if (isIconSetBoard && board.variants) {
      for (const ref of board.variants) {
        const existingLabel = draft["icon-sets"][ref.id]?.label
        if (existingLabel) existing.add(existingLabel)
      }
    }

    const clone: EntryIconSet = {
      ...entry,
      id: newId,
      type: "variant",
      label: getNextVariantLabel(base, existing),
      template: formatIconSetLink(payload.iconSetId),
      overrides: structuredClone(entry.overrides) as EntryIconSet["overrides"],
    }

    draft["icon-sets"][newId] = clone

    if (isIconSetBoard && board.variants) {
      board.variants.push({ id: newId })
    }
  })
}
