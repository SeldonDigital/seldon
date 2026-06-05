import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../../index"
import {
  deleteIconSetOverrideAtPath,
  setIconSetOverrideAtPath,
} from "../../../helpers/icon-sets/icon-set-id"
import type { EntryIconSet } from "../../../model/entry-icon-set"

/**
 * Writes `payload.value` into `workspace["icon-sets"][iconSetId].overrides` at
 * `payload.path`. Use `null` as the value to remove that entry. Icon inclusion
 * lives at `includedIcons.{iconId}`.
 */
export function setIconSetOverride(
  payload: ExtractPayload<"set_icon_set_override">,
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
    if (payload.value === null) {
      deleteIconSetOverrideAtPath(overrides, payload.path)
    } else {
      setIconSetOverrideAtPath(overrides, payload.path, payload.value)
    }
    entry.overrides = overrides
  })
}
