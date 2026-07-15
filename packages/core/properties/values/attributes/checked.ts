import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { BooleanOptionValue } from "../shared/option/boolean"

/** Not set, or a picked boolean option for toggles, checkboxes, and similar controls. */
export type CheckedValue = EmptyValue | BooleanOptionValue

/** Defines labels, allowed shapes, checks, and preset choices for `checked`. */
export const checkedSchema: PropertySchema = {
  name: "checked",
  description: "Checked state for toggles, checkboxes, and similar controls",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
