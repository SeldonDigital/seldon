import chroma from "chroma-js"

import type { HSL } from "../../properties/values/shared/exact/hsl"
import { Colorspace } from "../constants/colorspace"
import type { ThemeMode } from "../constants/enums"
import type { Theme } from "../types/theme"
import type { ThemeSwatch } from "../values/shared/palette/theme-swatch"

/**
 * Neutral slots that flip between appearances by exchanging their authored
 * colors. Every theme authors them literally: `offWhite` holds a light color
 * and `offBlack` a dark one. The light appearance serves the literal
 * assignment and the dark appearance serves the swapped assignment, regardless
 * of the theme's authored mode. No derivation ever applies to them.
 */
export const MODE_SWAPPED_SWATCH_PAIRS: ReadonlyArray<
  readonly [string, string]
> = [
  ["white", "black"],
  ["foreground", "background"],
  ["offBlack", "offWhite"],
]

/** Flat set of the paired neutral slot ids. */
export const MODE_SWAPPED_SWATCH_IDS: ReadonlySet<string> = new Set(
  MODE_SWAPPED_SWATCH_PAIRS.flat(),
)

/**
 * Swatches that never take the `chromaChange` adjustment. The paired slots
 * swap authored colors at the table level; `gray` inverts lightness only.
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

/** Returns a swatch's authored color as HSL without any transformation. */
function swatchToHsl(swatch: ThemeSwatch): HSL {
  if (swatch.parameters.colorspace === Colorspace.HSL) {
    return swatch.parameters.value
  }
  return chromaToHsl(swatchToChroma(swatch))
}

/**
 * Computes the full swatch table for one target appearance, keyed by swatch
 * id. Paired neutral slots carry authored values as-is: the literal assignment
 * for light, the swapped assignment for dark, independent of the authored
 * mode. Every other swatch stays authored when the target matches the
 * authored mode and derives through LCH otherwise, with `chromaChange` coming
 * from the theme's color harmony parameters.
 */
export function getModeSwatches(
  theme: Theme,
  targetMode: ThemeMode,
): Record<string, HSL> {
  const authoredMode = theme.colorHarmony.parameters.mode ?? "light"
  const chromaChange = theme.colorHarmony.parameters.chromaChange ?? 0
  const result: Record<string, HSL> = {}

  const swapPartner = new Map<string, string>()
  for (const [a, b] of MODE_SWAPPED_SWATCH_PAIRS) {
    swapPartner.set(a, b)
    swapPartner.set(b, a)
  }

  for (const [swatchId, swatch] of Object.entries(theme.swatch)) {
    if (!swatch) continue

    const partnerId = swapPartner.get(swatchId)
    if (partnerId) {
      const partner =
        targetMode === "dark"
          ? (theme.swatch[partnerId as keyof Theme["swatch"]] ?? swatch)
          : swatch
      result[swatchId] = swatchToHsl(partner)
      continue
    }

    result[swatchId] =
      targetMode === authoredMode
        ? swatchToHsl(swatch)
        : getOppositeModeSwatchColor(swatch, swatchId, chromaChange)
  }

  return result
}
