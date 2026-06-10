import { EmptyValue } from "../../shared/empty/empty"
import { LetterSpacingValue } from "../letter-spacing"
import { TextCaseValue } from "../text-casing"
import type { FontValue } from "./font"
import { FontFamilyValue } from "./font-family"
import { FontSizeValue } from "./font-size"
import { FontStyleValue } from "./font-style"
import { FontWeightValue } from "./font-weight"
import { LineHeightValue } from "./line-height"

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
