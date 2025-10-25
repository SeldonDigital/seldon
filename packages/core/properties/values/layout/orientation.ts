import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

export enum Orientation {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

export interface OrientationPresetValue {
  type: ValueType.PRESET
  value: Orientation
}

export type OrientationValue = EmptyValue | OrientationPresetValue

export const orientationSchema: PropertySchema = {
  name: "orientation",
  description: "Layout orientation (horizontal/vertical)",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(Orientation).includes(value),
  },
  presetOptions: () => Object.values(Orientation),
}
