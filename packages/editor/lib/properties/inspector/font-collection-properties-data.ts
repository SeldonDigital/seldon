import { getFontLicenseHref } from "@seldon/editor/lib/font-collections/font-license"
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
import {
  RESOURCE_PRESET_OPTIONS,
  RESOURCE_TOGGLE_OPTIONS,
  createResourceMenuRow,
  resourcePresetDisplayValue,
} from "./resource-menu-rows"

/** Builds a read-only license link row. */
function createLicenseRow(slot: string): FlatProperty {
  return {
    key: `family.${slot}.license`,
    propertyType: "atomic",
    label: "License",
    icon: "seldon-text",
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
    icon: "seldon-text",
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

    // None is the baseline; an enabled family (any weight on) is an override.
    rows.push(
      createResourceMenuRow(
        `family.${slot}`,
        family.name,
        resourcePresetDisplayValue(preset),
        RESOURCE_PRESET_OPTIONS,
        false,
        true,
        preset === "none" ? "set" : "override",
      ),
    )

    for (const variant of sortFontVariants(variants)) {
      const enabled = isVariantEnabled(slotSelection, variant)
      rows.push(
        createResourceMenuRow(
          `family.${slot}.${variant}`,
          fontVariantDisplayLabel(variant),
          enabled ? "On" : "Off",
          RESOURCE_TOGGLE_OPTIONS,
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
