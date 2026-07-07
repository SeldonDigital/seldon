import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { BooleanOptionValue, BooleanValue } from "../../shared/option/boolean"

/** Unset or a boolean toggling whether a conic gradient repeats. */
export type GradientRepeatValue = EmptyValue | BooleanValue | BooleanOptionValue

/** Validates the conic gradient repeat toggle. */
export const gradientRepeatSchema: PropertySchema = {
  name: "gradientRepeat",
  description: "Repeats a conic gradient around the center when enabled.",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "boolean",
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
