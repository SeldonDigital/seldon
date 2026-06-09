import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** Whether the node appears in the workspace, stays hidden, or drops out of the tree. */
export enum Display {
  SHOW = "show",
  HIDE = "hide",
  EXCLUDE = "exclude",
}

/** Stores show, hide, or exclude as a freeform exact value from the Display enum. */
export interface DisplayExactValue {
  type: ValueType.EXACT
  value: Display
}

/** Picks show, hide, or exclude from the Display enum. */
export interface DisplayOptionValue {
  type: ValueType.OPTION
  value: Display
}

/** Unset, a freeform exact value, or a picked option from Display. */
export type DisplayValue = EmptyValue | DisplayExactValue | DisplayOptionValue

export const displaySchema: PropertySchema = {
  name: "display",
  description:
    "Controls whether the element shows, stays hidden, or is excluded from the tree.",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string" && value.length > 0,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(Display) as string[]).includes(value),
  },
  presetOptions: () => Object.values(Display),
}
