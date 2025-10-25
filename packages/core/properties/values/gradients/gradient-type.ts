import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

export enum GradientType {
  LINEAR = "linear",
  RADIAL = "radial",
}

export interface GradientTypePresetValue {
  type: ValueType.PRESET
  value: GradientType
}

export type GradientTypeValue = EmptyValue | GradientTypePresetValue

export const gradientTypeSchema: PropertySchema = {
  name: "gradientType",
  description: "Gradient type for background styling",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(GradientType).includes(value),
  },
  presetOptions: () => Object.values(GradientType),
}
