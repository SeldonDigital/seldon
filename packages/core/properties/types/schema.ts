import { Theme } from "../../themes/types"
import { ComputedFunction, Unit } from "../constants"

export type PropertyValueType =
  | "empty"
  | "inherit"
  | "exact"
  | "preset"
  | "computed"
  | "themeCategorical"
  | "themeOrdinal"

export interface PropertySchema {
  name: string
  description: string
  supports: readonly PropertyValueType[]
  validation: {
    empty?: () => boolean
    inherit?: () => boolean
    exact?: (value: any) => boolean
    preset?: (value: any) => boolean
    computed?: (value: any) => boolean
    themeCategorical?: (value: any, theme?: Theme) => boolean
    themeOrdinal?: (value: any, theme?: Theme) => boolean
  }
  presetOptions?: () => any[]
  themeCategoricalKeys?: (theme: Theme) => string[]
  themeOrdinalKeys?: (theme: Theme) => string[]
  computedFunctions?: () => ComputedFunction[]

  // NEW: Unit metadata
  units?: {
    allowed: Unit[] // e.g., [Unit.PX, Unit.REM]
    default: Unit // e.g., Unit.PX
    validation?: "number" | "percentage" | "both"
  }
}
