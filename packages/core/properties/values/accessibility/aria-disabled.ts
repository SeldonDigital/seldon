import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { BooleanOptionValue, BooleanValue } from "../shared/option/boolean"

/** Not set, a freeform boolean, or a picked boolean for the disabled state exposed to assistive technologies. */
export type AriaDisabledValue = EmptyValue | BooleanValue | BooleanOptionValue

/** Defines labels, allowed shapes, checks, and preset choices for `ariaDisabled`. */
export const ariaDisabledSchema: PropertySchema = {
  name: "ariaDisabled",
  description: "Whether assistive technologies report the node as disabled",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "boolean",
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
