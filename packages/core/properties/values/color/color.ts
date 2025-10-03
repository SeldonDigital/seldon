import { ComputedHighContrastValue } from "../computed/high-contrast-color"
import { ComputedMatchValue } from "../computed/match"
import { HexValue } from "./hex"
import { HSLValue } from "./hsl"
import { LCHValue } from "./lch"
import { RGBValue } from "./rgb"
import { ColorThemeValue } from "./theme"
import { TransparentValue } from "./transparent"

export type ColorValue =
  | ColorThemeValue
  | HSLValue
  | RGBValue
  | LCHValue
  | HexValue
  | ComputedHighContrastValue
  | ComputedMatchValue
  | TransparentValue
