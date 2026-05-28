import { PropertySchema } from "../../types/schema"

/** Defines labels, allowed shapes, and checks for `ariaLabel`. */
export const ariaLabelSchema: PropertySchema = {
  name: "ariaLabel",
  description: "Accessible name override for assistive technologies",
  supports: ["empty", "inherit", "exact"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string",
  },
}
