import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { BooleanOptionValue, BooleanValue } from "../shared/option/boolean"

/** Unset, a freeform boolean, or a picked boolean option that turns clipping of overflow on or off. */
export type ClipValue = EmptyValue | BooleanValue | BooleanOptionValue

export const clipSchema: PropertySchema = {
  name: "clip",
  description: "Cuts off content that extends past the element bounds when enabled.",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "boolean",
    option: (value: any) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
