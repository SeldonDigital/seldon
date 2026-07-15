import { PropertySchema } from "../../types/schema"

/** Defines labels, allowed shapes, checks, and preset choices for `ariaHidden`. */
export const ariaHiddenSchema: PropertySchema = {
  name: "ariaHidden",
  description: "Whether the node is excluded from the accessibility tree",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
