import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { BooleanOptionValue } from "../shared/option/boolean"

/** Not set, or a picked boolean for the read only state. */
export type AriaReadonlyValue = EmptyValue | BooleanOptionValue

/** Defines labels, allowed shapes, checks, and preset choices for `ariaReadonly`. */
export const ariaReadonlySchema: PropertySchema = {
  name: "ariaReadonly",
  description: "Whether the node is read only for assistive technologies",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
