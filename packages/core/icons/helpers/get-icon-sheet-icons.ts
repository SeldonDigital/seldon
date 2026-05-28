import { IconId } from "@seldon/core/icons"
import { IconCategoryPath } from "../categories"
import { IconSetId } from "../types"
import {
  getIconCategoryFromId,
  iconBelongsToIconSet,
} from "./get-icon-category-from-id"

/**
 * Gets icons for a specific icon sheet (category/subcategory)
 * Filters by inclusion status
 * Returns optimized data structure for rendering
 */
export function getIconSheetIcons(
  iconSetId: IconSetId,
  categoryPath: IconCategoryPath,
  includedIcons: IconId[],
): IconId[] {
  return includedIcons.filter((iconId) => {
    // Verify icon belongs to this icon set
    if (!iconBelongsToIconSet(iconId, iconSetId)) return false
    // Verify icon belongs to this category
    return getIconCategoryFromId(iconId) === categoryPath
  })
}

/**
 * Gets all category paths that have icons in the included icons list
 */
export function getCategoryPathsWithIcons(
  iconSetId: IconSetId,
  includedIcons: IconId[],
): IconCategoryPath[] {
  const categoryPaths = new Set<IconCategoryPath>()

  for (const iconId of includedIcons) {
    if (iconBelongsToIconSet(iconId, iconSetId)) {
      const categoryPath = getIconCategoryFromId(iconId)
      categoryPaths.add(categoryPath)
    }
  }

  return Array.from(categoryPaths)
}
