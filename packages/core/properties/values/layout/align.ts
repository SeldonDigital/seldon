import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { AlignPresetValue } from "../shared/preset/align"

export enum Align {
  AUTO = "auto",
  TOP_LEFT = "top-left",
  TOP_CENTER = "top-center",
  TOP_RIGHT = "top-right",
  CENTER_LEFT = "left",
  CENTER = "center",
  CENTER_RIGHT = "right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_CENTER = "bottom-center",
  BOTTOM_RIGHT = "bottom-right",
}

export type AlignValue = EmptyValue | AlignPresetValue

export const alignSchema: PropertySchema = {
  name: "align",
  description: "Element alignment options",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(Align).includes(value),
  },
  presetOptions: () => Object.values(Align),
}
