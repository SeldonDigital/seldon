import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** Keyword describing how a live region announces updates. */
export enum AriaLive {
  OFF = "off",
  POLITE = "polite",
  ASSERTIVE = "assertive",
}

/** Records which `aria-live` keyword is selected. */
export interface AriaLiveOptionValue {
  type: ValueType.OPTION
  value: AriaLive
}

/** Empty, or an `aria-live` keyword. */
export type AriaLiveValue = EmptyValue | AriaLiveOptionValue

/** Defines labels, allowed shapes, checks, and preset choices for `ariaLive`. */
export const ariaLiveSchema: PropertySchema = {
  name: "ariaLive",
  description: "How a live region announces updates to assistive technologies",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string" && value.length > 0,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(AriaLive) as string[]).includes(value),
  },
  presetOptions: () => Object.values(AriaLive),
}
