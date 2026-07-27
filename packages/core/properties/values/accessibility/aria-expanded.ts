import type { PropertySchema } from "../../types/schema"
import type { EmptyValue } from "../shared/empty/empty"
import type { BooleanOptionValue } from "../shared/option/boolean"

/** Not set, or a picked boolean for the expanded state of an expandable node. */
export type AriaExpandedValue = EmptyValue | BooleanOptionValue

/** Defines labels, allowed shapes, checks, and preset choices for `ariaExpanded`. */
export const ariaExpandedSchema: PropertySchema = {
  name: "ariaExpanded",
  description: "Whether an expandable node is currently open",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
