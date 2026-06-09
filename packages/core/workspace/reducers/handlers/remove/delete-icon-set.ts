import { produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"
import { iconSetBoardKeyFromEntryId } from "../../../helpers/icon-sets/icon-set-id"
import type { EntryIconSet } from "../../../model/entry-icon-set"
import { isEntryIconSetDefault } from "../../../model/entry-icon-set"

/** Deletes one variant `icon-sets` entry and drops its ref from the owning board. */
export function deleteIconSet(
  payload: ExtractPayload<"delete_icon_set">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft["icon-sets"][payload.iconSetId] as
      | EntryIconSet
      | undefined
    if (!entry || isEntryIconSetDefault(entry)) return

    delete draft["icon-sets"][payload.iconSetId]

    const boardKey = iconSetBoardKeyFromEntryId(payload.iconSetId)
    if (!boardKey) return
    const board = draft.boards[boardKey]
    if (board?.type !== "icon-set" || !board.variants) return
    board.variants = board.variants.filter((r) => r.id !== payload.iconSetId)
  })
}
