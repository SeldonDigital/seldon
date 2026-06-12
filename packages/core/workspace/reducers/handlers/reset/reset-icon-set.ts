import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import type { EntryIconSet } from "../../../model/entry-icon-set"

/** Clears every override on one `icon-sets` entry. */
export function resetIconSet(
  payload: ExtractPayload<"reset_icon_set">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft["icon-sets"][payload.iconSetId] as
      | EntryIconSet
      | undefined
    if (!entry) return
    entry.overrides = {}
  })
}
