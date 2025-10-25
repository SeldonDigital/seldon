import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

export enum InputType {
  TEXT = "text",
  NUMBER = "number",
  EMAIL = "email",
  PASSWORD = "password",
  SEARCH = "search",
  TEL = "tel",
  URL = "url",
  DATE = "date",
  DATETIME_LOCAL = "datetime-local",
  CHECKBOX = "checkbox",
  RADIO = "radio",
}

export interface InputTypePresetValue {
  type: ValueType.PRESET
  value: InputType
}

export type InputTypeValue = EmptyValue | InputTypePresetValue

export const inputTypeSchema: PropertySchema = {
  name: "inputType",
  description: "Input element type for forms",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(InputType).includes(value),
  },
  presetOptions: () => Object.values(InputType),
}
