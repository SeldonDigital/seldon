import type { IconId } from "../../icon-sets"
import {
  type IconCategory,
  categorySubcategories,
  iconCategories,
} from "../constants/categories"
import type { ComputedIconSet } from "../types/icon-set"
import { getIconCategoryFromId } from "./get-icon-category-from-id"

/**
 * Per-icon inclusion for an icon set entry. An icon set entry stores which icons
 * are on. The selection lives in the entry overrides under `includedIcons`,
 * keyed by icon id. An absent icon falls back to the set's default categories,
 * so the default entry needs no stored selection.
 */
export type IconInclusion = Record<string, boolean>

/** Top-level category of an icon, such as `user-interface`. */
function getIconTopCategory(iconId: IconId): IconCategory {
  return getIconCategoryFromId(iconId).split("/")[0] as IconCategory
}

/** True when an icon belongs to a category that is enabled by default. */
export function isIconEnabledByDefault(
  set: ComputedIconSet,
  iconId: IconId,
): boolean {
  return set.defaultEnabledCategories.includes(getIconTopCategory(iconId))
}

/** Icons enabled by default, derived from the set's default categories. */
export function getDefaultIncludedIcons(set: ComputedIconSet): IconId[] {
  return set.icons.filter((iconId) => isIconEnabledByDefault(set, iconId))
}

/** True when an icon is on. Explicit overrides win over the default categories. */
export function isIconIncluded(
  set: ComputedIconSet,
  inclusion: IconInclusion | undefined,
  iconId: IconId,
): boolean {
  const explicit = inclusion?.[iconId]
  if (typeof explicit === "boolean") return explicit
  return isIconEnabledByDefault(set, iconId)
}

/**
 * Orders a set's icons by category then subcategory, matching the order the
 * properties panel renders them (`iconCategories` -> `categorySubcategories` ->
 * icons within each subcategory). Icons whose category path is not represented
 * are appended last, preserving their original order.
 */
export function getIconsInCategoryOrder(set: ComputedIconSet): IconId[] {
  const ordered: IconId[] = []
  const seen = new Set<IconId>()
  for (const category of iconCategories) {
    for (const subcategory of categorySubcategories[category]) {
      for (const iconId of getIconsInSubcategory(
        set,
        `${category}/${subcategory}`,
      )) {
        if (seen.has(iconId)) continue
        ordered.push(iconId)
        seen.add(iconId)
      }
    }
  }
  for (const iconId of set.icons) {
    if (seen.has(iconId)) continue
    ordered.push(iconId)
    seen.add(iconId)
  }
  return ordered
}

/**
 * Resolves the included icons for an entry in category then subcategory order,
 * matching the properties panel. Applies overrides on the defaults.
 */
export function getIncludedIcons(
  set: ComputedIconSet,
  inclusion: IconInclusion | undefined,
): IconId[] {
  return getIconsInCategoryOrder(set).filter((iconId) =>
    isIconIncluded(set, inclusion, iconId),
  )
}

/** Preset for a subcategory, derived from how many of its icons are on. */
export type IconSubcategoryPreset = "all" | "none" | "custom"

/** Icons in the set that belong to a `category/subcategory` path. */
export function getIconsInSubcategory(
  set: ComputedIconSet,
  subcategoryPath: string,
): IconId[] {
  return set.icons.filter(
    (iconId) => getIconCategoryFromId(iconId) === subcategoryPath,
  )
}

/** Icons in the set that belong to a top-level category. */
export function getIconsInCategory(
  set: ComputedIconSet,
  category: IconCategory,
): IconId[] {
  return set.icons.filter((iconId) => getIconTopCategory(iconId) === category)
}

/** Derives the preset for a subcategory from its icons' inclusion. */
export function deriveSubcategoryPreset(
  set: ComputedIconSet,
  inclusion: IconInclusion | undefined,
  subcategoryPath: string,
): IconSubcategoryPreset {
  const icons = getIconsInSubcategory(set, subcategoryPath)
  if (icons.length === 0) return "none"
  const enabled = icons.filter((iconId) =>
    isIconIncluded(set, inclusion, iconId),
  ).length
  if (enabled === icons.length) return "all"
  if (enabled === 0) return "none"
  return "custom"
}
