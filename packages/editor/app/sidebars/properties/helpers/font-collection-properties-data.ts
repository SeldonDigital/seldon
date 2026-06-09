import { getFontLicenseHref } from "@lib/font-collections/font-license"
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

/** Builds an editable menu row (preset on a family or on/off on a variant). */
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

/** Builds a read-only license link row. */
function createLicenseRow(slot: string): FlatProperty {
  return {
    key: `family.${slot}.license`,
    propertyType: "atomic",
    label: "License",
    icon: "IconTextValue",
    value: { type: ValueType.EXACT, value: "View" },
    actualValue: "View",
    valueType: ValueType.EXACT,
    controlType: undefined,
    isCompound: false,
    isShorthand: false,
    isSubProperty: true,
    status: "set",
    isDimmed: true,
    linkHref: getFontLicenseHref(slot),
  }
}

/** Builds a read-only atomic row for a family with no selectable variants. */
function createPlainFamilyRow(
  slot: string,
  name: string,
  origin: string,
): FlatProperty {
  return {
    key: `family.${slot}`,
    propertyType: "atomic",
    label: name,
    icon: "IconTextValue",
    value: { type: ValueType.EXACT, value: origin },
    actualValue: origin,
    valueType: ValueType.EXACT,
    controlType: undefined,
    isCompound: false,
    isShorthand: false,
    isSubProperty: false,
    status: "set",
    isDimmed: true,
  }
}

/**
 * Builds the Families section rows for a font collection. Each family with
 * selectable variants becomes a compound row with a preset control, one On/Off
 * toggle per variant, and a license link. Families without variants render as a
 * single read-only row.
 *
 * Returns parents and children in one flat list. The parent rows carry
 * `isSubProperty: false`; children carry `isSubProperty: true` so the property
 * tree nests them under their family.
 */
export function flattenFontCollectionFamilies(
  collection: ComputedFontCollection,
  selection: VariantSelection,
  showUnusedFonts: boolean = true,
): FlatProperty[] {
  const rows: FlatProperty[] = []

  for (const [slot, family] of Object.entries(collection.families)) {
    const variants = family.variants ?? []
    const slotSelection = selection[slot]

    if (variants.length === 0) {
      rows.push(createPlainFamilyRow(slot, family.name, family.origin))
      continue
    }

    const preset = deriveVariantPreset(slotSelection, variants)

    // A `None` family is unused, so hide it (parent, weights, and license)
    // unless the view explicitly shows unused fonts.
    if (preset === "none" && !showUnusedFonts) {
      continue
    }

    const presetValue =
      preset === "all" ? "All" : preset === "none" ? "None" : "Custom"

    // None is the baseline; an enabled family (any weight on) is an override.
    rows.push(
      createMenuRow(
        `family.${slot}`,
        family.name,
        presetValue,
        PRESET_OPTIONS,
        false,
        true,
        preset === "none" ? "set" : "override",
      ),
    )

    for (const variant of sortFontVariants(variants)) {
      const enabled = isVariantEnabled(slotSelection, variant)
      rows.push(
        createMenuRow(
          `family.${slot}.${variant}`,
          fontVariantDisplayLabel(variant),
          enabled ? "On" : "Off",
          TOGGLE_OPTIONS,
          true,
          false,
          enabled ? "override" : "set",
        ),
      )
    }

    if (family.origin === "remote") {
      rows.push(createLicenseRow(slot))
    }
  }

  return rows
}
