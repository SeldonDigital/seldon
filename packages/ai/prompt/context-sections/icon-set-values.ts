import {
  categorySubcategories,
  iconCategories,
} from "@seldon/core/icon-sets/constants"
import {
  deriveSubcategoryPreset,
  getIconsInSubcategory,
} from "@seldon/core/icon-sets/helpers"
import { workspaceIconSetService } from "@seldon/core/workspace/services/icon-set/icon-set.service"
import type { Workspace } from "@seldon/core/workspace/types"

import { section } from "./section"

const TITLE =
  "Icon set subcategories (toggle a whole subcategory with set_icon_set_subcategory_preset, or one icon with set_icon_set_override at path includedIcons.<iconId>):"

/**
 * Lists the subcategories of one icon set entry with each subcategory's preset
 * (all/none/custom) and icon count, so the model can turn groups on or off in
 * one step. Enumerating every icon would be too large for the turn context, so
 * this stays at the subcategory level; a single icon is toggled by its id.
 * Returns [] when the entry is missing, so the caller drops the section.
 */
export function iconSetValuesSection(
  iconSetId: string,
  workspace: Workspace,
): string[] {
  const set = workspaceIconSetService.getIconSet(iconSetId, workspace)
  if (!set) return []
  const inclusion = workspaceIconSetService.getInclusion(iconSetId, workspace)

  const body: string[] = [`entry: ${iconSetId}`]
  for (const category of iconCategories) {
    for (const subcategory of categorySubcategories[category]) {
      const subcategoryPath = `${category}/${subcategory}`
      const icons = getIconsInSubcategory(set, subcategoryPath)
      if (icons.length === 0) continue
      const preset = deriveSubcategoryPreset(set, inclusion, subcategoryPath)
      body.push(`- ${subcategoryPath} preset=${preset} (${icons.length} icons)`)
    }
  }
  return section(TITLE, body)
}
