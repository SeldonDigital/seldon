import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** Keyword describing the validity state of an input. */
export enum AriaInvalid {
  FALSE = "false",
  TRUE = "true",
  GRAMMAR = "grammar",
  SPELLING = "spelling",
}

/** Records which `aria-invalid` keyword is selected. */
export interface AriaInvalidOptionValue {
  type: ValueType.OPTION
  value: AriaInvalid
}

/** Empty, or an `aria-invalid` keyword. */
export type AriaInvalidValue = EmptyValue | AriaInvalidOptionValue

/** Defines labels, allowed shapes, checks, and preset choices for `ariaInvalid`. */
export const ariaInvalidSchema: PropertySchema = {
  name: "ariaInvalid",
  description: "Validity state reported for an input",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string" && value.length > 0,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(AriaInvalid) as string[]).includes(value),
  },
  presetOptions: () => Object.values(AriaInvalid),
}
