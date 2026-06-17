import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import type { EntryIconSet } from "../../../model/entry-icon-set"

/** Sets `workspace["icon-sets"][iconSetId].label`. */
export function setIconSetLabel(
  payload: ExtractPayload<"set_icon_set_label">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft["icon-sets"][payload.iconSetId] as
      | EntryIconSet
      | undefined
    if (!entry) return
    entry.label = payload.label
  })
}
