import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { deleteOverrideAtPath } from "../../../helpers/general/override-paths"
import type { EntryIconSet } from "../../../model/entry-icon-set"

/** Removes one dot-path from `overrides` on an `icon-sets` entry. */
export function resetIconSetOverride(
  payload: ExtractPayload<"reset_icon_set_override">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft["icon-sets"][payload.iconSetId] as
      | EntryIconSet
      | undefined
    if (!entry) return
    const overrides: Record<string, unknown> = {
      ...(entry.overrides as Record<string, unknown>),
    }
    deleteOverrideAtPath(overrides, payload.path)
    entry.overrides = overrides
  })
}
