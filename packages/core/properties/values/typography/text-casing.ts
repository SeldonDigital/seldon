import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** Letter casing choices applied to displayed text. */
export enum TextCasing {
  NORMAL = "normal",
  LOWERCASE = "lowercase",
  UPPERCASE = "uppercase",
  CAPITALIZE = "capitalize",
}

/** Stores one casing choice from the enum. */
export interface TextCaseOptionValue {
  type: ValueType.OPTION
  value: TextCasing
}

/** Empty or one named casing choice. */
export type TextCaseValue = EmptyValue | TextCaseOptionValue

/** Validates stored text case values. */
export const textCaseSchema: PropertySchema = {
  name: "textCase",
  description: "Sets how letters capitalize or stay lower for displayed text.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(TextCasing) as string[]).includes(value),
  },
  presetOptions: () => Object.values(TextCasing),
}
