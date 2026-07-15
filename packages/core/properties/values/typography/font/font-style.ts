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

// TODO: `oblique <angle>` (e.g. "oblique 10deg") is a real CSS value that needs
// an `exact` string shape. It is not supported yet; add `exact` back with an
// angle-aware validator when angled oblique lands. For now slant is the fixed
// normal/italic/oblique option set only.
/** Validates stored font style values. */
export const fontStyleSchema: PropertySchema = {
  name: "fontStyle",
  description: "Sets slant from normal, italic, or oblique.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(FontStyle) as string[]).includes(value),
  },
  presetOptions: () => Object.values(FontStyle),
}
