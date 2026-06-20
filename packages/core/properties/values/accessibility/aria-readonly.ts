import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { BooleanOptionValue, BooleanValue } from "../shared/option/boolean"

/** Not set, a freeform boolean, or a picked boolean for the read only state. */
export type AriaReadonlyValue = EmptyValue | BooleanValue | BooleanOptionValue

/** Defines labels, allowed shapes, checks, and preset choices for `ariaReadonly`. */
export const ariaReadonlySchema: PropertySchema = {
  name: "ariaReadonly",
  description: "Whether the node is read only for assistive technologies",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "boolean",
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
