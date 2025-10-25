import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

export enum Direction {
  LTR = "ltr",
  RTL = "rtl",
}

export interface DirectionPresetValue {
  type: ValueType.PRESET
  value: Direction
}

export type DirectionValue = EmptyValue | DirectionPresetValue

export const directionSchema: PropertySchema = {
  name: "direction",
  description: "Text direction (LTR/RTL)",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(Direction).includes(value),
  },
  presetOptions: () => Object.values(Direction),
}
