import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"

/** Named font style keywords supported in the catalog. */
export enum FontStyle {
  NORMAL = "normal",
  ITALIC = "italic",
  OBLIQUE = "oblique",
}

/** Stores one font style keyword from the enum. */
export interface FontStyleOptionValue {
  type: ValueType.OPTION
  value: FontStyle
}

/** Empty or one named font style keyword. */
export type FontStyleValue = EmptyValue | FontStyleOptionValue

/** Validates stored font style values. */
export const fontStyleSchema: PropertySchema = {
  name: "fontStyle",
  description: "Sets slant from normal, italic, or oblique, or a custom CSS string.",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) =>
      typeof value === "string" && value.length > 0,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(FontStyle) as string[]).includes(value),
  },
  presetOptions: () => Object.values(FontStyle),
}
