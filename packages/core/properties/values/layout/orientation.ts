import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** Stacks and flows run across the width or up the height of the container. */
export enum Orientation {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

/** Picks horizontal or vertical layout as an option value. */
export interface OrientationOptionValue {
  type: ValueType.OPTION
  value: Orientation
}

/** Unset or a picked horizontal or vertical choice from Orientation. */
export type OrientationValue = EmptyValue | OrientationOptionValue

export const orientationSchema: PropertySchema = {
  name: "orientation",
  description: "Controls whether layout stacks horizontally or vertically.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(Orientation) as string[]).includes(value),
  },
  presetOptions: () => Object.values(Orientation),
}
