import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { BooleanValue } from "../shared/option/boolean"

/** Not set, or a boolean that controls exposure to the accessibility tree. */
export type AriaHiddenValue = EmptyValue | BooleanValue

/** Defines labels, allowed shapes, checks, and preset choices for `ariaHidden`. */
export const ariaHiddenSchema: PropertySchema = {
  name: "ariaHidden",
  description: "Whether the node is excluded from the accessibility tree",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "boolean",
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
