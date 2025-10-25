import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

export enum ScrollbarStyle {
  DEFAULT = "default",
  HIDDEN = "hidden",
  OVERLAY = "overlay",
  THIN = "thin",
}

export interface ScrollbarStylePresetValue {
  type: ValueType.PRESET
  value: ScrollbarStyle
}

export type ScrollbarStyleValue = EmptyValue | ScrollbarStylePresetValue

export const scrollbarStyleSchema: PropertySchema = {
  name: "scrollbarStyle",
  description: "Scrollbar appearance style",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(ScrollbarStyle).includes(value),
  },
  presetOptions: () => Object.values(ScrollbarStyle),
}
