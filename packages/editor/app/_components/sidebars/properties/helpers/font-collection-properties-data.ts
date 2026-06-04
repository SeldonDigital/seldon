import type { ComputedFontCollection } from "@seldon/core/font-collections/types"
import { ValueType } from "@seldon/core/properties"
import { FlatProperty } from "./properties-data"

/** Builds one read-only, dimmed atomic row for a font family. */
function createFamilyRow(slot: string, name: string, origin: string): FlatProperty {
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
 * Builds the read-only Families section rows for a font collection. Each row
 * shows the family name and its origin (`local` or `remote`).
 */
export function flattenFontCollectionFamilies(
  collection: ComputedFontCollection,
): FlatProperty[] {
  return Object.entries(collection.families).map(([slot, family]) =>
    createFamilyRow(slot, family.name, family.origin),
  )
}
