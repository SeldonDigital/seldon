import {
  ThemeFontKey,
  ThemeFontSizeKey,
  ThemeFontWeightKey,
  ThemeLineHeightKey,
} from "../../../../themes/types"
import { FontStyle, TextCasing } from "../../../values"
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
  preset?: (FontValue | EmptyValue) & {
    restrictions?: {
      allowedValues?: ThemeFontKey[]
    }
  }
  family?: (FontFamilyValue | EmptyValue) & {
    restrictions?: {
      allowedValues?: string[]
    }
  }
  style?: (FontStyleValue | EmptyValue) & {
    restrictions?: {
      allowedValues?: FontStyle[]
    }
  }
  weight?: (FontWeightValue | EmptyValue) & {
    restrictions?: {
      allowedValues?: ThemeFontWeightKey[]
    }
  }
  size?: (FontSizeValue | EmptyValue) & {
    restrictions?: {
      allowedValues?: ThemeFontSizeKey[]
    }
  }
  lineHeight?: (LineHeightValue | EmptyValue) & {
    restrictions?: {
      allowedValues?: ThemeLineHeightKey[]
    }
  }
  textCase?: (TextCaseValue | EmptyValue) & {
    restrictions?: {
      allowedValues?: TextCasing[]
    }
  }
  letterSpacing?: (LetterSpacingValue | EmptyValue) & {
    restrictions?: {
      allowedValues?: string[]
    }
  }
}

export * from "./font"
export * from "./font-family"
export * from "./font-style"
export * from "./font-weight"
export * from "./font-size"
export * from "./line-height"
