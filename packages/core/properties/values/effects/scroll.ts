import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

export enum Scroll {
  NONE = "none",
  BOTH = "both",
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

export interface ScrollPresetValue {
  type: ValueType.PRESET
  value: Scroll
}

export type ScrollValue = EmptyValue | ScrollPresetValue

export const scrollSchema: PropertySchema = {
  name: "scroll",
  description: "Element scroll behavior",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(Scroll).includes(value),
  },
  presetOptions: () => Object.values(Scroll),
}
