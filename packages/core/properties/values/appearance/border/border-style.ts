import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"

export enum BorderStyle {
  NONE = "none",
  SOLID = "solid",
  DASHED = "dashed",
  DOTTED = "dotted",
  DOUBLE = "double",
  GROOVE = "groove",
  RIDGE = "ridge",
  INSET = "inset",
  OUTSET = "outset",
  HIDDEN = "hidden",
}

export interface BorderStylePresetValue {
  type: ValueType.PRESET
  value: BorderStyle
}

export type BorderStyleValue = EmptyValue | BorderStylePresetValue

export const borderStyleSchema: PropertySchema = {
  name: "borderStyle",
  description: "Border line style",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(BorderStyle).includes(value),
  },
  presetOptions: () => Object.values(BorderStyle),
}
