import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { BooleanOptionValue } from "../shared/option/boolean"

/** Not set, or a picked boolean for whether input is required. */
export type AriaRequiredValue = EmptyValue | BooleanOptionValue

/** Defines labels, allowed shapes, checks, and preset choices for `ariaRequired`. */
export const ariaRequiredSchema: PropertySchema = {
  name: "ariaRequired",
  description: "Whether user input is required before submission",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
