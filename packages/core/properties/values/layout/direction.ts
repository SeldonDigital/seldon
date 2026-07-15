import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** Reading order for text and child layout that follows writing direction. */
export enum Direction {
  LTR = "ltr",
  RTL = "rtl",
}

/** Picks left-to-right or right-to-left as an option value. */
export interface DirectionOptionValue {
  type: ValueType.OPTION
  value: Direction
}

/** Unset or a picked preset reading direction. */
export type DirectionValue = EmptyValue | DirectionOptionValue

export const directionSchema: PropertySchema = {
  name: "direction",
  description: "Sets left-to-right or right-to-left reading and layout order.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(Direction) as string[]).includes(value),
  },
  presetOptions: () => [
    { value: Direction.LTR, name: "Left to Right" },
    { value: Direction.RTL, name: "Right to Left" },
  ],
}
