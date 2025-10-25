import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

export enum TextCasing {
  NORMAL = "normal",
  LOWERCASE = "lowercase",
  UPPERCASE = "uppercase",
  CAPITALIZE = "capitalize",
}

export interface TextCasePresetValue {
  type: ValueType.PRESET
  value: TextCasing
}

export type TextCaseValue = EmptyValue | TextCasePresetValue

export const textCaseSchema: PropertySchema = {
  name: "textCase",
  description: "Text case transformation",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(TextCasing).includes(value),
  },
  presetOptions: () => Object.values(TextCasing),
}
