import { produce } from "immer"

import { getIconsInSubcategory } from "../../../../icon-sets/helpers"
import { ExtractPayload, Workspace } from "../../../../index"
import { setOverrideAtPath } from "../../../helpers/general/override-paths"
import type { EntryIconSet } from "../../../model/entry-icon-set"
import { workspaceIconSetService } from "../../../services"

/**
 * Applies a preset to a subcategory on an icon set entry. `all` includes every
 * icon in the subcategory; `none` excludes every icon. Both write explicit
 * booleans under `includedIcons`, mirroring the font collection family preset.
 */
export function setIconSetSubcategoryPreset(
  payload: ExtractPayload<"set_icon_set_subcategory_preset">,
  workspace: Workspace,
): Workspace {
  const set = workspaceIconSetService.getIconSet(payload.iconSetId, workspace)
  const icons = set ? getIconsInSubcategory(set, payload.subcategory) : []

  return produce(workspace, (draft) => {
    const entry = draft["icon-sets"][payload.iconSetId] as
      | EntryIconSet
      | undefined
    if (!entry) return
    const overrides: Record<string, unknown> = {
      ...(entry.overrides as Record<string, unknown>),
    }
    const value = payload.preset === "all"
    for (const iconId of icons) {
      setOverrideAtPath(overrides, `includedIcons.${iconId}`, value)
    }
    entry.overrides = overrides
  })
}
