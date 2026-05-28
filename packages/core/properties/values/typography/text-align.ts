import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** Horizontal alignment choices for text inside its container. */
export enum TextAlign {
  AUTO = "auto",
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
  JUSTIFY = "justify",
}

/** Stores one text alignment choice from the enum. */
export interface TextAlignOptionValue {
  type: ValueType.OPTION
  value: TextAlign
}

/** Empty or one named horizontal alignment choice. */
export type TextAlignValue = EmptyValue | TextAlignOptionValue

/** Validates stored text alignment values. */
export const textAlignSchema: PropertySchema = {
  name: "textAlign",
  description: "Sets horizontal text alignment from auto through justify.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(TextAlign) as string[]).includes(value),
  },
  presetOptions: () => Object.values(TextAlign),
}
