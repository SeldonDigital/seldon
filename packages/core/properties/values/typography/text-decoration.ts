import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** Line styles drawn on text such as underlines and strike-through. */
export enum TextDecoration {
  NONE = "none",
  UNDERLINE = "underline",
  OVERLINE = "overline",
  LINE_THROUGH = "line-through",
}

/** Stores one decoration choice from the enum. */
export interface TextDecorationOptionValue {
  type: ValueType.OPTION
  value: TextDecoration
}

/** Empty or one named decoration choice. */
export type TextDecorationValue = EmptyValue | TextDecorationOptionValue

/** Validates stored text decoration values. */
export const textDecorationSchema: PropertySchema = {
  name: "textDecoration",
  description: "Sets underlines and similar marks on the text, or none.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(TextDecoration) as string[]).includes(value),
  },
  presetOptions: () => Object.values(TextDecoration),
}
