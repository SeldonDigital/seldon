import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"

/** Named line drawing for border strokes. */
export enum BorderStyle {
  NONE = "none",
  SOLID = "solid",
  DASHED = "dashed",
  DOTTED = "dotted",
  DOUBLE = "double",
  GROOVE = "groove",
  RIDGE = "ridge",
  INSET = "inset",
  OUTSET = "outset",
  HIDDEN = "hidden",
}

/** Stores one border style choice from the enum. */
export interface BorderStyleOptionValue {
  type: ValueType.OPTION
  value: BorderStyle
}

/** Empty or one named border line style. */
export type BorderStyleValue = EmptyValue | BorderStyleOptionValue

/** Validates stored border style values. */
export const borderStyleSchema: PropertySchema = {
  name: "borderStyle",
  description:
    "Sets which stroke pattern the border uses, including when no line shows.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(BorderStyle) as string[]).includes(value),
  },
  presetOptions: () => Object.values(BorderStyle),
}
