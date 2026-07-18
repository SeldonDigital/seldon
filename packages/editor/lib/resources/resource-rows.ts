import {
  type VariantSelection,
  deriveVariantPreset,
  isVariantEnabled,
} from "@seldon/core/font-collections"
import type { ComputedFontCollection } from "@seldon/core/font-collections/types"
import {
  fontVariantDisplayLabel,
  sortFontVariants,
} from "@seldon/core/helpers/utils/font-variant"
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
import { capitalize } from "@seldon/core/themes/helpers/capitalize"
import { getFontLicenseHref } from "../font-collections/font-license"

/** All/None/Custom preset options for a resource parent row. */
const PRESET_OPTIONS = [
  { label: "All", value: "All" },
  { label: "None", value: "None" },
  { label: "Custom", value: "Custom" },
]

/** On/Off options for a resource child toggle row. */
const TOGGLE_OPTIONS = [
  { label: "On", value: "On" },
  { label: "Off", value: "Off" },
]

export type ResourceControl =
  | {
      kind: "option"
      value: string
      options: Array<{ label: string; value: string }>
    }
  | { kind: "readonly"; value: string }
  | { kind: "link"; value: string; href: string }

export interface ResourceRow {
  key: string
  label: string
  control: ResourceControl
  isSubProperty: boolean
  isOverridden: boolean
  isDimmed: boolean
}

export interface ResourceRowSection {
  section: string
  label: string
  rows: ResourceRow[]
}

/** Display value for a derived All/None/Custom preset. */
function presetDisplayValue(preset: "all" | "none" | "custom"): string {
  return preset === "all" ? "All" : preset === "none" ? "None" : "Custom"
}

/** Title-cases a hyphenated or slashed token, e.g. `user-interface` -> `User Interface`. */
function titleCase(token: string): string {
  return token
    .split(/[-/]/)
    .filter(Boolean)
    .map(capitalize)
    .join(" ")
}

/**
 * Builds the Families section rows for a font collection. Each family with
 * selectable variants becomes a preset row, one On/Off toggle per variant, and
 * a license link. Families without variants render as a single read-only row.
 * Mirrors the React `flattenFontCollectionFamilies` read side.
 */
export function buildFontCollectionRows(
  collection: ComputedFontCollection,
  selection: VariantSelection,
  showUnusedFonts: boolean = true,
): ResourceRowSection[] {
  const rows: ResourceRow[] = []

  for (const [slot, family] of Object.entries(collection.families)) {
    const variants = family.variants ?? []
    const slotSelection = selection[slot]

    if (variants.length === 0) {
      rows.push({
        key: `family.${slot}`,
        label: family.name,
        control: { kind: "readonly", value: family.origin },
        isSubProperty: false,
        isOverridden: false,
        isDimmed: true,
      })
      continue
    }

    const preset = deriveVariantPreset(slotSelection, variants)
    if (preset === "none" && !showUnusedFonts) continue

    rows.push({
      key: `family.${slot}`,
      label: family.name,
      control: {
        kind: "option",
        value: presetDisplayValue(preset),
        options: PRESET_OPTIONS,
      },
      isSubProperty: false,
      isOverridden: preset !== "none",
      isDimmed: false,
    })

    for (const variant of sortFontVariants(variants)) {
      const enabled = isVariantEnabled(slotSelection, variant)
      rows.push({
        key: `family.${slot}.${variant}`,
        label: fontVariantDisplayLabel(variant),
        control: {
          kind: "option",
          value: enabled ? "On" : "Off",
          options: TOGGLE_OPTIONS,
        },
        isSubProperty: true,
        isOverridden: enabled,
        isDimmed: false,
      })
    }

    if (family.origin === "remote") {
      rows.push({
        key: `family.${slot}.license`,
        label: "License",
        control: { kind: "link", value: "View", href: getFontLicenseHref(slot) },
        isSubProperty: true,
        isOverridden: false,
        isDimmed: true,
      })
    }
  }

  return rows.length > 0
    ? [{ section: "families", label: "Families", rows }]
    : []
}

/**
 * Builds the icon rows for an icon set, grouped by category. Each subcategory
 * with icons becomes a preset row followed by one On/Off toggle per icon.
 * Mirrors the React `flattenIconSetCategories` read side.
 */
export function buildIconSetRows(
  set: ComputedIconSet,
  inclusion: IconInclusion | undefined,
  showUnusedIcons: boolean = true,
): ResourceRowSection[] {
  const sections: ResourceRowSection[] = []

  for (const category of iconCategories) {
    const rows: ResourceRow[] = []

    for (const subcategory of categorySubcategories[category as IconCategory]) {
      const subcategoryPath = `${category}/${subcategory}`
      const icons = getIconsInSubcategory(set, subcategoryPath)
      if (icons.length === 0) continue

      const preset = deriveSubcategoryPreset(set, inclusion, subcategoryPath)
      if (preset === "none" && !showUnusedIcons) continue

      rows.push({
        key: `icon.${subcategoryPath}`,
        label: titleCase(subcategory),
        control: {
          kind: "option",
          value: presetDisplayValue(preset),
          options: PRESET_OPTIONS,
        },
        isSubProperty: false,
        isOverridden: preset !== "none",
        isDimmed: false,
      })

      for (const iconId of icons) {
        const enabled = isIconIncluded(set, inclusion, iconId)
        rows.push({
          key: `icon.${subcategoryPath}.${iconId}`,
          label: iconLabels[iconId as keyof typeof iconLabels] ?? iconId,
          control: {
            kind: "option",
            value: enabled ? "On" : "Off",
            options: TOGGLE_OPTIONS,
          },
          isSubProperty: true,
          isOverridden: enabled,
          isDimmed: false,
        })
      }
    }

    if (rows.length > 0) {
      sections.push({ section: category, label: titleCase(category), rows })
    }
  }

  return sections
}
