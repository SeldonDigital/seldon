import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"

export enum FontStyle {
  NORMAL = "normal",
  ITALIC = "italic",
}

export interface FontStylePresetValue {
  type: ValueType.PRESET
  value: FontStyle
}

export type FontStyleValue = EmptyValue | FontStylePresetValue

export const fontStyleSchema: PropertySchema = {
  name: "fontStyle",
  description: "Font style (normal, italic)",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(FontStyle).includes(value),
  },
  presetOptions: () => Object.values(FontStyle),
}
