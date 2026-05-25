import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** Stacks and flows run across the width or up the height of the container. */
export enum Orientation {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

/** Stores a horizontal or vertical orientation as a freeform exact value. */
export interface OrientationExactValue {
  type: ValueType.EXACT
  value: Orientation
}

/** Picks horizontal or vertical layout as an option value. */
export interface OrientationOptionValue {
  type: ValueType.OPTION
  value: Orientation
}

/** Unset, a freeform exact value, or a picked horizontal or vertical choice from Orientation. */
export type OrientationValue =
  | EmptyValue
  | OrientationExactValue
  | OrientationOptionValue

export const orientationSchema: PropertySchema = {
  name: "orientation",
  description: "Controls whether layout stacks horizontally or vertically.",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    option: (value: any) => Object.values(Orientation).includes(value),
  },
  presetOptions: () => Object.values(Orientation),
}
