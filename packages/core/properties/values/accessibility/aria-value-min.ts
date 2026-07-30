import { ariaValueUnits, isAriaValueNumber } from "./aria-value"

import type { PropertySchema } from "../../types/schema"

/** Defines labels, allowed shapes, and checks for `ariaValueMin`. */
export const ariaValueMinSchema: PropertySchema = {
  name: "ariaValueMin",
  description: "Lowest value allowed by a range widget such as a progress bar or slider",
  supports: ["empty", "inherit", "exact"] as const,
  units: ariaValueUnits,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: isAriaValueNumber,
  },
}
