import { PropertySchema } from "../../types/schema"

export const wrapTextSchema: PropertySchema = {
  name: "wrapText",
  description: "Whether to wrap text content",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
