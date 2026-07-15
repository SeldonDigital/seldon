import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** Keyword marking which item in a set is the current one. */
export enum AriaCurrent {
  FALSE = "false",
  TRUE = "true",
  PAGE = "page",
  STEP = "step",
  LOCATION = "location",
  DATE = "date",
  TIME = "time",
}

/** Records which `aria-current` keyword is selected. */
export interface AriaCurrentOptionValue {
  type: ValueType.OPTION
  value: AriaCurrent
}

/** Empty, or an `aria-current` keyword. */
export type AriaCurrentValue = EmptyValue | AriaCurrentOptionValue

/** Defines labels, allowed shapes, checks, and preset choices for `ariaCurrent`. */
export const ariaCurrentSchema: PropertySchema = {
  name: "ariaCurrent",
  description: "Marks the current item within a set of related items",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(AriaCurrent) as string[]).includes(value),
  },
  presetOptions: () => Object.values(AriaCurrent),
}
