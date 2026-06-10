import type { IconId } from "@seldon/core/icon-sets"
import { iconLabels } from "@seldon/core/icon-sets"
import {
  type IconCategory,
  categorySubcategories,
  iconCategories,
} from "@seldon/core/icon-sets/constants"
import {
  type IconInclusion,
  deriveSubcategoryPreset,
  getIconsInSubcategory,
  isIconIncluded,
} from "@seldon/core/icon-sets/helpers"
import type { ComputedIconSet } from "@seldon/core/icon-sets/types"
import { ValueType } from "@seldon/core/properties"
import { FlatProperty } from "./properties-data"

const PRESET_OPTIONS = [
  { name: "All", value: "All" },
  { name: "None", value: "None" },
  { name: "Custom", value: "Custom" },
]

const TOGGLE_OPTIONS = [
  { name: "On", value: "On" },
  { name: "Off", value: "Off" },
]

const ICON_CATEGORY_SET = new Set<string>(iconCategories)

/** Title-cases a hyphenated or slashed token, such as `user-interface` -> `User Interface`. */
function titleCase(token: string): string {
  return token
    .split(/[-/]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/** Display label for an icon category section. */
export function iconCategoryLabel(category: string): string {
  return titleCase(category)
}

/** Top-level icon category encoded in a row key, or null when not an icon row. */
export function getIconRowCategory(key: string): IconCategory | null {
  if (!key.startsWith("icon.")) return null
  const category = key.slice("icon.".length).split("/")[0]
  return ICON_CATEGORY_SET.has(category) ? (category as IconCategory) : null
}

/** Builds an editable menu row (preset on a subcategory or on/off on an icon). */
function createMenuRow(
  key: string,
  label: string,
  value: string,
  options: Array<{ name: string; value: string }>,
  isSubProperty: boolean,
  isCompound: boolean,
  status: FlatProperty["status"],
): FlatProperty {
  return {
    key,
    propertyType: isCompound ? "compound" : "atomic",
    label,
    icon: "IconTextValue",
    value: { type: ValueType.EXACT, value },
    actualValue: value,
    valueType: ValueType.EXACT,
    controlType: "menu",
    isCompound,
    isShorthand: false,
    isSubProperty,
    status,
    options,
  }
}

/**
 * Builds the icon rows for an icon set, grouped by category and subcategory.
 * Each subcategory with icons becomes a compound preset row (All/None/Custom)
 * followed by one On/Off toggle per icon. Subcategories with every icon off are
 * hidden unless the view explicitly shows unused icons.
 *
 * Returns parents and children in one flat list. Parent rows carry
 * `isSubProperty: false`; icon rows carry `isSubProperty: true` so the property
 * tree nests them under their subcategory. The category is encoded in the key
 * (`icon.<category>/<subcategory>`) so the tree can split rows into sections.
 */
export function flattenIconSetCategories(
  set: ComputedIconSet,
  inclusion: IconInclusion | undefined,
  showUnusedIcons: boolean = true,
): FlatProperty[] {
  const rows: FlatProperty[] = []

  for (const category of iconCategories) {
    for (const subcategory of categorySubcategories[category]) {
      const subcategoryPath = `${category}/${subcategory}`
      const icons = getIconsInSubcategory(set, subcategoryPath)
      if (icons.length === 0) continue

      const preset = deriveSubcategoryPreset(set, inclusion, subcategoryPath)

      // A subcategory with no icons on is unused, so hide it unless the view
      // explicitly shows unused icons.
      if (preset === "none" && !showUnusedIcons) {
        continue
      }

      const presetValue =
        preset === "all" ? "All" : preset === "none" ? "None" : "Custom"

      rows.push(
        createMenuRow(
          `icon.${subcategoryPath}`,
          titleCase(subcategory),
          presetValue,
          PRESET_OPTIONS,
          false,
          true,
          preset === "none" ? "set" : "override",
        ),
      )

      for (const iconId of icons) {
        const enabled = isIconIncluded(set, inclusion, iconId)
        rows.push(
          createMenuRow(
            `icon.${subcategoryPath}.${iconId}`,
            iconLabels[iconId as keyof typeof iconLabels] ?? iconId,
            enabled ? "On" : "Off",
            TOGGLE_OPTIONS,
            true,
            false,
            enabled ? "override" : "set",
          ),
        )
      }
    }
  }

  return rows
}
