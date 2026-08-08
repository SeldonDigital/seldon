import { iconCategoryMapping as seldonMapping } from "../catalog/seldon/category-map"
import { DEFAULT_CATEGORY_PATH } from "../constants/categories"
import { matchCategoryKeyword } from "../constants/category-keywords"
import { vendorIconCategories } from "../constants/icon-categories"

import type { IconId } from "../../icon-sets"
import type { IconCategoryPath } from "../constants/categories"
import type { IconSetId } from "../types"

/**
 * Gets the icon ID prefix for an icon set ID
 * Example: "google-material" → "material-"
 */
function getIconIdPrefix(iconSetId: IconSetId): string {
  switch (iconSetId) {
    case "google-material":
      return "material-"
    case "carbon":
      return "carbon-"
    case "lucide":
      return "lucide-"
    case "seldon":
      return "seldon-"
  }
}

/**
 * Checks if an icon ID belongs to an icon set ID
 */
export function iconBelongsToIconSet(iconId: IconId, iconSetId: IconSetId): boolean {
  const prefix = getIconIdPrefix(iconSetId)

  return iconId.startsWith(prefix)
}

/**
 * Gets the category path for an icon id. The seldon set uses its folder-derived
 * map. The vendor sets use the curated `vendorIconCategories` source, falling
 * back to the shared keyword table for an id not listed there, so a newly seeded
 * icon still categorizes without a hand edit.
 */
export function getIconCategoryFromId(iconId: IconId): IconCategoryPath {
  if (iconId.startsWith("seldon-")) {
    return seldonMapping[iconId] || DEFAULT_CATEGORY_PATH
  }

  return vendorIconCategories[iconId] ?? matchCategoryKeyword(iconId)
}
