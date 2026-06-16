import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** Marker glyph drawn for list items, or none. */
export enum ListStyleType {
  NONE = "none",
  DISC = "disc",
  CIRCLE = "circle",
  SQUARE = "square",
  DECIMAL = "decimal",
  DECIMAL_LEADING_ZERO = "decimal-leading-zero",
  LOWER_ALPHA = "lower-alpha",
  UPPER_ALPHA = "upper-alpha",
  LOWER_ROMAN = "lower-roman",
  UPPER_ROMAN = "upper-roman",
}

/** Stores one marker choice from the enum. */
export interface ListStyleTypeOptionValue {
  type: ValueType.OPTION
  value: ListStyleType
}

/** Empty or one named marker choice. */
export type ListStyleTypeValue = EmptyValue | ListStyleTypeOptionValue

export const listStyleTypeSchema: PropertySchema = {
  name: "listStyleType",
  description: "Sets the marker glyph for list items, or none.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(ListStyleType) as string[]).includes(value),
  },
  presetOptions: () => Object.values(ListStyleType),
}
