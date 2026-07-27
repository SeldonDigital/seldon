import type { EmptyValue } from "../../shared/empty/empty"
import type { LetterSpacingValue } from "../letter-spacing"
import type { TextCaseValue } from "../text-casing"
import type { FontValue } from "./font"
import type { FontFamilyValue } from "./font-family"
import type { FontSizeValue } from "./font-size"
import type { FontStyleValue } from "./font-style"
import type { FontWeightValue } from "./font-weight"
import type { LineHeightValue } from "./line-height"

export type FontCompound = {
  preset?: FontValue | EmptyValue
  family?: FontFamilyValue | EmptyValue
  style?: FontStyleValue | EmptyValue
  weight?: FontWeightValue | EmptyValue
  size?: FontSizeValue | EmptyValue
  lineHeight?: LineHeightValue | EmptyValue
  textCase?: TextCaseValue | EmptyValue
  letterSpacing?: LetterSpacingValue | EmptyValue
}

export * from "./font"
export * from "./font-family"
export * from "./font-style"
export * from "./font-weight"
export * from "./font-size"
export * from "./line-height"
