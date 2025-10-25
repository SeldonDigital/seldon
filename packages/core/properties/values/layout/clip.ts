import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { BooleanValue } from "../shared/preset/boolean"

export type ClipValue = EmptyValue | BooleanValue

export const clipSchema: PropertySchema = {
  name: "clip",
  description: "Element clipping behavior",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "boolean",
    preset: (value: any) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
