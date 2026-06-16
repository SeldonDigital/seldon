import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** Whether the list marker sits outside or inside the item content box. */
export enum ListStylePosition {
  OUTSIDE = "outside",
  INSIDE = "inside",
}

/** Stores one marker position choice from the enum. */
export interface ListStylePositionOptionValue {
  type: ValueType.OPTION
  value: ListStylePosition
}

/** Empty or one named marker position choice. */
export type ListStylePositionValue = EmptyValue | ListStylePositionOptionValue

export const listStylePositionSchema: PropertySchema = {
  name: "listStylePosition",
  description: "Places the list marker outside or inside the item content box.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(ListStylePosition) as string[]).includes(value),
  },
  presetOptions: () => Object.values(ListStylePosition),
}
