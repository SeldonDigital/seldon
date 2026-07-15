import { PropertySchema } from "../../types/schema"
import { Align } from "./align"

export const cellAlignSchema: PropertySchema = {
  name: "cellAlign",
  description: "Positions content inside a table cell using named anchors.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(Align) as string[]).includes(value),
  },
  presetOptions: () => Object.values(Align),
}
