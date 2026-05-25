import { PropertySchema } from "../../types/schema"
import { Align } from "./align"

export const cellAlignSchema: PropertySchema = {
  name: "cellAlign",
  description: "Positions content inside a table cell using named anchors.",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string" && value.length > 0,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(Align) as string[]).includes(value),
  },
  presetOptions: () => Object.values(Align),
}
