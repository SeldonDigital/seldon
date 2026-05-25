import { PropertySchema } from "../../../types/schema"

/** Validates blend mode strings on one background paint layer. */
export const backgroundBlendModeSchema: PropertySchema = {
  name: "backgroundBlendMode",
  description:
    "Sets how this layer mixes with what is already drawn behind it.",
  supports: ["empty", "inherit", "exact"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string" && value.length > 0,
  },
}
