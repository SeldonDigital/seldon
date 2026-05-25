import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { BooleanOptionValue, BooleanValue } from "../shared/option/boolean"

/** Not set, a freeform boolean, or a picked boolean option for toggles, checkboxes, and similar controls. */
export type CheckedValue = EmptyValue | BooleanValue | BooleanOptionValue

/** Defines labels, allowed shapes, checks, and preset choices for `checked`. */
export const checkedSchema: PropertySchema = {
  name: "checked",
  description: "Checked state for toggles, checkboxes, and similar controls",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "boolean",
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
