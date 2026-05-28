import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** Which directions allow scrolling inside the element. */
export enum Scroll {
  NONE = "none",
  BOTH = "both",
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

/** Stores one scroll direction choice from the enum. */
export interface ScrollOptionValue {
  type: ValueType.OPTION
  value: Scroll
}

/** Empty or one named scroll direction choice. */
export type ScrollValue = EmptyValue | ScrollOptionValue

/** Validates stored scroll direction values. */
export const scrollSchema: PropertySchema = {
  name: "scroll",
  description:
    "Sets which directions users can scroll inside the element, from none through both axes.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(Scroll) as string[]).includes(value),
  },
  presetOptions: () => Object.values(Scroll),
}
