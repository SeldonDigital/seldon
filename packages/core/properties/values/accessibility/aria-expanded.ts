import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { BooleanOptionValue, BooleanValue } from "../shared/option/boolean"

/** Not set, a freeform boolean, or a picked boolean for the expanded state of an expandable node. */
export type AriaExpandedValue = EmptyValue | BooleanValue | BooleanOptionValue

/** Defines labels, allowed shapes, checks, and preset choices for `ariaExpanded`. */
export const ariaExpandedSchema: PropertySchema = {
  name: "ariaExpanded",
  description: "Whether an expandable node is currently open",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "boolean",
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
