import chroma from "chroma-js"

import type { HSL } from "../../properties/values/shared/exact/hsl"
import { Colorspace } from "../constants/colorspace"
import type { Theme } from "../types/theme"
import type { ThemeSwatch } from "../values/shared/palette/theme-swatch"

/**
 * Swatches that flip between modes by lightness inversion only. The
 * `chromaChange` adjustment never applies to them.
 */
export const MODE_NEUTRAL_SWATCH_IDS = new Set<string>([
  "white",
  "gray",
  "black",
  "foreground",
  "background",
  "offBlack",
  "offWhite",
])

function swatchToChroma(swatch: ThemeSwatch): chroma.Color {
  const { parameters } = swatch
  switch (parameters.colorspace) {
    case Colorspace.HSL:
      return chroma.hsl(
        parameters.value.hue,
        parameters.value.saturation / 100,
        parameters.value.lightness / 100,
      )
    case Colorspace.RGB:
      return chroma.rgb(
        parameters.value.red,
        parameters.value.green,
        parameters.value.blue,
      )
    case Colorspace.LCH:
      return chroma.lch(
        parameters.value.lightness,
        parameters.value.chroma,
        parameters.value.hue,
      )
    case Colorspace.HEX:
    case Colorspace.NAME:
      return chroma(parameters.value)
  }
}

function chromaToHsl(color: chroma.Color): HSL {
  const [rawHue, sa, li] = color.hsl()
  const hu = Number.isFinite(rawHue) ? rawHue : 0
  const hue = Math.round(((hu % 360) + 360) % 360)
  const lightness = Math.round(Math.max(0, Math.min(100, (li ?? 0) * 100)))
  // Pure black and white carry no chroma; the RGB roundtrip can leave junk
  // saturation there, so zero it instead of serializing the artifact.
  const saturation =
    lightness <= 0 || lightness >= 100
      ? 0
      : Math.round(Math.max(0, Math.min(100, (sa ?? 0) * 100)))
  return { hue, saturation, lightness }
}

/**
 * Derives the opposite-mode color for one swatch. The color moves through LCH:
 * lightness inverts, and non-neutral swatches scale chroma by `chromaChange`
 * percent. The result comes back as HSL for stylesheet output.
 */
export function getOppositeModeSwatchColor(
  swatch: ThemeSwatch,
  swatchId: string,
  chromaChange: number,
): HSL {
  const [lightness, chromaValue, rawHue] = swatchToChroma(swatch).lch()
  const hue = Number.isFinite(rawHue) ? rawHue : 0

  const invertedLightness = Math.max(0, Math.min(100, 100 - lightness))
  const adjustedChroma = MODE_NEUTRAL_SWATCH_IDS.has(swatchId)
    ? chromaValue
    : Math.max(0, chromaValue * (1 + chromaChange / 100))

  return chromaToHsl(chroma.lch(invertedLightness, adjustedChroma, hue))
}

/**
 * Computes the opposite-mode color for every swatch on a computed theme, keyed
 * by swatch id. `chromaChange` comes from the theme's color harmony parameters.
 */
export function getOppositeModeSwatches(theme: Theme): Record<string, HSL> {
  const chromaChange = theme.colorHarmony.parameters.chromaChange ?? 0
  const result: Record<string, HSL> = {}

  for (const [swatchId, swatch] of Object.entries(theme.swatch)) {
    if (!swatch) continue
    result[swatchId] = getOppositeModeSwatchColor(swatch, swatchId, chromaChange)
  }

  return result
}
