import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

export enum Display {
  SHOW = "show",
  HIDE = "hide",
  EXCLUDE = "exclude",
}

export interface DisplayPresetValue {
  type: ValueType.PRESET
  value: Display
}

export type DisplayValue = EmptyValue | DisplayPresetValue

export const displaySchema: PropertySchema = {
  name: "display",
  description: "Element display behavior",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(Display).includes(value),
  },
  presetOptions: () => Object.values(Display),
}
