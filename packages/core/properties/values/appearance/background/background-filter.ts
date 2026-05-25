import { PropertySchema } from "../../../types/schema"

/** Validates filter strings on one background paint layer. */
export const backgroundFilterSchema: PropertySchema = {
  name: "backgroundFilter",
  description: "Sets stacked blur and color treatments for this layer.",
  supports: ["empty", "inherit", "exact"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string" && value.length > 0,
  },
}
