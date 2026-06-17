import { PropertySchema } from "../../types/schema"

/** Defines labels, allowed shapes, and checks for `placeholder`. */
export const placeholderSchema: PropertySchema = {
  name: "placeholder",
  description: "Placeholder text for inputs and similar controls",
  supports: ["empty", "inherit", "exact"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string",
  },
}
