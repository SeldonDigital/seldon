import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** HTML input type strings the catalog exposes as fixed choices. */
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

/** Records which input type keyword is selected. */
export interface InputTypeOptionValue {
  type: ValueType.OPTION
  value: InputType
}

/** Empty, or an input type keyword from the list above. */
export type InputTypeValue = EmptyValue | InputTypeOptionValue

/** Defines labels, allowed shapes, checks, and preset choices for `inputType`. */
export const inputTypeSchema: PropertySchema = {
  name: "inputType",
  description: "Input type for form components (text, email, password, etc.)",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(InputType) as string[]).includes(value),
  },
  presetOptions: () => Object.values(InputType),
}
