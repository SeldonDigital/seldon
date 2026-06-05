import type { IconId } from "../../icon-sets"
import type { IconCategory } from "../categories"
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

/** Resolves the included icons for an entry, applying overrides on the defaults. */
export function getIncludedIcons(
  set: ComputedIconSet,
  inclusion: IconInclusion | undefined,
): IconId[] {
  return set.icons.filter((iconId) => isIconIncluded(set, inclusion, iconId))
}
