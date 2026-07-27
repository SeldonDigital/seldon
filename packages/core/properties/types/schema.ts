import type { Theme } from "../../themes/types"
import type { Workspace } from "../../workspace/types"
import type { ComputedFunction, Unit } from "../constants"
import type { PropertyDisplayCategory } from "../constants/property-display"

/** Labels each storage shape a property may accept on a node. */
export type PropertyValueType =
  | "empty"
  | "inherit"
  | "exact"
  | "option"
  | "computed"
  | "themeCategorical"
  | "themeOrdinal"

/**
 * Schema for one property key in the property schema catalog: label, allowed storage shapes,
 * checks, and optional picker lists, theme key sources, computed handlers, or unit rules.
 *
 * `supports` lists the storage shapes the key accepts and `validation` supplies the per-shape
 * checks. `displayCategory` is the panel grouping from `PROPERTY_DISPLAY_ORDER` and `displayOrder`
 * is the global sort key across the flattened catalog. Both are always set on merged
 * `PROPERTY_SCHEMAS` entries and optional on raw per-value modules. `presetOptions` supplies picker
 * entries when the field stores `ValueType.OPTION`. `themeCategoricalKeys` and `themeOrdinalKeys`
 * list the `@`-style keys or token ids for the categorical and ordinal theme pickers.
 * `computedFunctions` lists the allowed `ComputedFunction` ids for computed pickers. `units` gives
 * the allowed unit suffixes and default when the property stores measured numbers.
 */
export interface PropertySchema {
  name: string
  description: string
  supports: readonly PropertyValueType[]
  validation: {
    empty?: () => boolean
    inherit?: () => boolean
    exact?: (value: unknown) => boolean
    option?: (value: unknown) => boolean
    computed?: (value: unknown) => boolean
    themeCategorical?: (value: unknown, theme?: Theme) => boolean
    themeOrdinal?: (value: unknown, theme?: Theme) => boolean
  }
  displayCategory?: PropertyDisplayCategory
  displayOrder?: number
  presetOptions?: (workspace?: Workspace) => unknown[]
  themeCategoricalKeys?: (theme: Theme) => string[]
  themeOrdinalKeys?: (theme: Theme) => string[]
  computedFunctions?: () => ComputedFunction[]
  units?: {
    allowed: Unit[]
    default: Unit
    validation?: "number" | "percentage" | "signedPercentage" | "both"
  }
}
