import { isVariantEnabled } from "@seldon/core/font-collections"
import { fontVariantDisplayLabel, sortFontVariants } from "@seldon/core/helpers/utils/font-variant"
import { ValueType } from "@seldon/core/properties"

import type { FlatProperty } from "./properties-data"
import type { VariantSelection } from "@seldon/core/font-collections"
import type { ComputedFontCollection } from "@seldon/core/font-collections/types"

/**
 * Builds the Installed Font Sizes rows for one family of a collection: an On/Off
 * switch per weight variant, keyed `family.<slot>.<variant>` so a toggle routes
 * through the font collection editing context and flips that variant. Returns an
 * empty list when the family is missing or exposes no selectable variants.
 *
 * The switch reads its stored boolean from the EXACT value and commits
 * `"true"`/`"false"`, the wire values the variant write path already accepts.
 */
export function flattenFontCollectionFamilySizes(
  collection: ComputedFontCollection,
  selection: VariantSelection,
  slot: string,
): FlatProperty[] {
  const family = collection.families[slot]

  if (!family) return []

  const variants = family.variants ?? []
  const slotSelection = selection[slot]

  return sortFontVariants(variants).map((variant) => {
    const enabled = isVariantEnabled(slotSelection, variant)

    return {
      key: `family.${slot}.${variant}`,
      propertyType: "atomic",
      label: fontVariantDisplayLabel(variant),
      icon: "material-formatSize",
      value: { type: ValueType.EXACT, value: enabled },
      actualValue: enabled ? "On" : "Off",
      valueType: ValueType.EXACT,
      controlType: "switch",
      isCompound: false,
      isShorthand: false,
      isSubProperty: false,
      status: enabled ? "override" : "set",
    }
  })
}
