import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

export enum TextDecoration {
  NONE = "none",
  UNDERLINE = "underline",
  OVERLINE = "overline",
  LINE_THROUGH = "line-through",
}

export interface TextDecorationPresetValue {
  type: ValueType.PRESET
  value: TextDecoration
}

export type TextDecorationValue = EmptyValue | TextDecorationPresetValue

export const textDecorationSchema: PropertySchema = {
  name: "textDecoration",
  description: "Text decoration styling",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(TextDecoration).includes(value),
  },
  presetOptions: () => Object.values(TextDecoration),
}
