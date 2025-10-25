import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { BooleanValue } from "../shared/preset/boolean"

export type WrapTextValue = EmptyValue | BooleanValue

export const wrapTextSchema: PropertySchema = {
  name: "wrapText",
  description: "Whether to wrap text content",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "boolean",
    preset: (value: any) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
