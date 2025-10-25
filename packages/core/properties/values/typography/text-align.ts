import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

export enum TextAlign {
  AUTO = "auto",
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
  JUSTIFY = "justify",
}

export interface TextAlignPresetValue {
  type: ValueType.PRESET
  value: TextAlign
}

export type TextAlignValue = EmptyValue | TextAlignPresetValue

export const textAlignSchema: PropertySchema = {
  name: "textAlign",
  description: "Text alignment within element",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(TextAlign).includes(value),
  },
  presetOptions: () => Object.values(TextAlign),
}
