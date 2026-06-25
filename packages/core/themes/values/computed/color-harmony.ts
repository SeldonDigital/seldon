import { Harmony } from "../../constants"
import type { ColorSpaceLiteral } from "../shared/exact/color-spaces"
import type { ThemeComputedGroup } from "./theme-computed-group"

/** Dynamic swatch / palette generation inputs. */
export interface ColorHarmonyParameters {
  baseColor: ColorSpaceLiteral
  harmony: Harmony
  angle: number
  step: number
  whitePoint: number
  grayPoint: number
  blackPoint: number
  bleed: number
}

export type ThemeColorHarmony = ThemeComputedGroup<ColorHarmonyParameters>
