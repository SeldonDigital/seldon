import { PropertySchema } from "../../types/schema"

/** Defines labels, allowed shapes, and checks for `altText`. */
export const altTextSchema: PropertySchema = {
  name: "altText",
  description: "Alternate text for images, icons, and similar content",
  supports: ["empty", "inherit", "exact"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string",
  },
}
