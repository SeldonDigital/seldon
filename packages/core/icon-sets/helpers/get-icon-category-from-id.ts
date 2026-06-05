import { iconCategoryMapping as seldonMapping } from "../mappings/seldon"
import { IconId } from "../../icon-sets"
import { DEFAULT_CATEGORY_PATH, IconCategoryPath } from "../categories"
import { iconCategoryMapping as carbonMapping } from "../mappings/carbon"
import { iconCategoryMapping as lucideMapping } from "../mappings/lucide"
import { iconCategoryMapping as materialMapping } from "../mappings/material"
import { IconSetId } from "../types"

/**
 * Extracts icon set ID from icon ID
 * Example: "material-add" → "google-material"
 */
function getIconSetIdFromIconId(iconId: IconId): IconSetId | null {
  if (iconId.startsWith("material-")) return "google-material"
  if (iconId.startsWith("carbon-")) return "carbon"
  if (iconId.startsWith("lucide-")) return "lucide"
  if (iconId.startsWith("seldon-")) return "seldon"
  return null
}

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
 * Gets the appropriate mapping for an icon ID
 */
function getMappingForIconId(
  iconId: IconId,
): Partial<Record<IconId, IconCategoryPath>> | null {
  if (iconId.startsWith("material-")) return materialMapping
  if (iconId.startsWith("carbon-")) return carbonMapping
  if (iconId.startsWith("lucide-")) return lucideMapping
  if (iconId.startsWith("seldon-")) return seldonMapping
  return null
}

/**
 * Checks if an icon ID belongs to an icon set ID
 */
export function iconBelongsToIconSet(
  iconId: IconId,
  iconSetId: IconSetId,
): boolean {
  const prefix = getIconIdPrefix(iconSetId)
  return iconId.startsWith(prefix)
}

/**
 * Gets the category path for an icon ID
 * Uses the per-set mappings generated from index-all.ts files
 */
export function getIconCategoryFromId(iconId: IconId): IconCategoryPath {
  const mapping = getMappingForIconId(iconId)
  return mapping?.[iconId] || DEFAULT_CATEGORY_PATH
}
