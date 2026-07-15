import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { BooleanOptionValue } from "../shared/option/boolean"

/** Not set, or a picked boolean for the selected state of a selectable node. */
export type AriaSelectedValue = EmptyValue | BooleanOptionValue

/** Defines labels, allowed shapes, checks, and preset choices for `ariaSelected`. */
export const ariaSelectedSchema: PropertySchema = {
  name: "ariaSelected",
  description: "Whether a selectable node is currently selected",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
