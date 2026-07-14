import { Theme } from "../../themes/types"
import { Workspace } from "../../workspace/types"
import { ComputedFunction, Unit } from "../constants"
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
 */
export interface PropertySchema {
  name: string
  description: string
  /**
   * Panel grouping per the properties README categories (`PROPERTY_DISPLAY_ORDER`).
   * Always set on merged `PROPERTY_SCHEMAS` entries; optional on raw per-value modules.
   */
  displayCategory?: PropertyDisplayCategory
  /** Global sort key across the flattened catalog. Always set on `PROPERTY_SCHEMAS`. */
  displayOrder?: number
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
  /** Supplies picker entries when the field stores `ValueType.OPTION`. */
  presetOptions?: (workspace?: Workspace) => unknown[]
  /** Lists `@`-style keys or token ids for categorical theme pickers. */
  themeCategoricalKeys?: (theme: Theme) => string[]
  /** Lists `@`-style keys or token ids for ordinal theme pickers. */
  themeOrdinalKeys?: (theme: Theme) => string[]
  /** Lists allowed `ComputedFunction` ids for computed pickers. */
  computedFunctions?: () => ComputedFunction[]

  /** Allowed unit suffixes and default when the property stores measured numbers. */
  units?: {
    allowed: Unit[]
    default: Unit
    validation?: "number" | "percentage" | "signedPercentage" | "both"
  }
}
