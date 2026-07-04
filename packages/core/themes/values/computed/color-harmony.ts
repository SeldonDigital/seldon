import { Harmony, type ThemeMode } from "../../constants"
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
  /** Mode the authored colors represent. Export derives the opposite mode. */
  mode: ThemeMode
  /** Chroma shift in percent, -100 through 100, applied to derived opposite-mode colors. */
  chromaChange: number
}

export type ThemeColorHarmony = ThemeComputedGroup<ColorHarmonyParameters>
