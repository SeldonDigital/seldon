import { PropertySchema } from "../../types/schema"

/** Defines labels, allowed shapes, and checks for `content`. */
export const contentSchema: PropertySchema = {
  name: "content",
  description: "Text content for text-based components",
  supports: ["empty", "inherit", "exact"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string",
  },
}
