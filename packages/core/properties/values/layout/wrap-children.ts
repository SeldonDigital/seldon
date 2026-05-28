import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { BooleanValue } from "../shared/option/boolean"

/** Unset or a boolean that turns child wrapping on or off. */
export type WrapChildrenValue = EmptyValue | BooleanValue

export const wrapChildrenSchema: PropertySchema = {
  name: "wrapChildren",
  description:
    "Sets whether children move to the next line or row instead of overflowing.",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "boolean",
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
