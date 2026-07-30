import { ariaValueUnits, isAriaValueNumber } from "./aria-value"

import type { PropertySchema } from "../../types/schema"

/** Defines labels, allowed shapes, and checks for `ariaValueNow`. */
export const ariaValueNowSchema: PropertySchema = {
  name: "ariaValueNow",
  description: "Current value of a range widget such as a progress bar or slider",
  supports: ["empty", "inherit", "exact"] as const,
  units: ariaValueUnits,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: isAriaValueNumber,
  },
}
