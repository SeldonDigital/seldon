import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** Reading order for text and child layout that follows writing direction. */
export enum Direction {
  LTR = "ltr",
  RTL = "rtl",
}

/** Stores a reading direction as a freeform exact value. */
export interface DirectionExactValue {
  type: ValueType.EXACT
  value: Direction
}

/** Picks left-to-right or right-to-left as an option value. */
export interface DirectionOptionValue {
  type: ValueType.OPTION
  value: Direction
}

/** Unset, a freeform exact value, or a picked preset reading direction. */
export type DirectionValue =
  | EmptyValue
  | DirectionExactValue
  | DirectionOptionValue

export const directionSchema: PropertySchema = {
  name: "direction",
  description: "Sets left-to-right or right-to-left reading order for text.",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string" && value.length > 0,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(Direction) as string[]).includes(value),
  },
  presetOptions: () => [
    { value: Direction.LTR, name: "Left to Right" },
    { value: Direction.RTL, name: "Right to Left" },
  ],
}
