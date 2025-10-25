import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { BooleanValue } from "../shared/preset/boolean"

export type AriaHiddenValue = EmptyValue | BooleanValue

export const ariaHiddenSchema: PropertySchema = {
  name: "ariaHidden",
  description: "Whether the element is hidden from screen readers",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "boolean",
    preset: (value: any) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
