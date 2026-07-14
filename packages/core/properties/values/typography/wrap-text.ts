import { PropertySchema } from "../../types/schema"

export const wrapTextSchema: PropertySchema = {
  name: "wrapText",
  description: "Whether to wrap text content",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "boolean",
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
