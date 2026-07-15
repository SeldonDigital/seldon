import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { BooleanOptionValue } from "../shared/option/boolean"

/** Not set, or a picked boolean for the disabled state exposed to assistive technologies. */
export type AriaDisabledValue = EmptyValue | BooleanOptionValue

/** Defines labels, allowed shapes, checks, and preset choices for `ariaDisabled`. */
export const ariaDisabledSchema: PropertySchema = {
  name: "ariaDisabled",
  description: "Whether assistive technologies report the node as disabled",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
