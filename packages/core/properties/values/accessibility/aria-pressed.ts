import { PropertySchema } from "../../types/schema"
import { AriaTristate } from "./aria-tristate"

/** Defines labels, allowed shapes, checks, and preset choices for `ariaPressed`. */
export const ariaPressedSchema: PropertySchema = {
  name: "ariaPressed",
  description: "Pressed state for toggle button roles",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(AriaTristate) as string[]).includes(value),
  },
  presetOptions: () => Object.values(AriaTristate),
}
