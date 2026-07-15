import { PropertySchema } from "../../types/schema"
import { AriaTristate } from "./aria-tristate"

/** Defines labels, allowed shapes, checks, and preset choices for `ariaChecked`. */
export const ariaCheckedSchema: PropertySchema = {
  name: "ariaChecked",
  description: "Checked state for checkbox, radio, and switch roles",
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
