import { PropertySchema } from "../../types/schema"

/** Defines labels, allowed shapes, and checks for `source`. */
export const sourceSchema: PropertySchema = {
  name: "source",
  description: "Image or media source (URL or path)",
  supports: ["empty", "inherit", "exact"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string",
  },
}
