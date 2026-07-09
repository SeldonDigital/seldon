import { ColorValue, ValueType } from "@seldon/core"
import { applyBrightness } from "@seldon/core/helpers/color/apply-brightness"
import {
  readAnchoredLayerPercentage,
  resolveBasedOnWithAnchor,
  resolveHighContrastForeground,
  resolveHighContrastSource,
} from "@seldon/core/properties/compute"
import { getModeSwatches } from "@seldon/core/themes/compute"
import type { ThemeMode } from "@seldon/core/themes/constants"
import type { Theme } from "@seldon/core/themes/types"

import { getColorCSSValue } from "../css-properties/get-color-css-value"
import {
  getBrightnessSwatches,
  recordBrightnessSwatch,
} from "./brightness-swatches"
import {
  REFERENCEABLE_SWATCH_SLOTS,
  highContrastBrightnessVarName,
  highContrastVarName,
  swatchIdFromRef,
} from "./names"
import { ComputedVariableStrategy } from "./types"

/** The share of the composited surface below which the backdrop drives contrast. */
const BACKDROP_DOMINANT_OPACITY = 50

function referenceableSlotFromValue(value: unknown): string | null {
  if (
    !value ||
    typeof value !== "object" ||
    !("type" in value) ||
    !("value" in value) ||
    value.type !== ValueType.THEME_CATEGORICAL
  ) {
    return null
  }
  const slot = swatchIdFromRef(String(value.value))
  return slot && REFERENCEABLE_SWATCH_SLOTS.has(slot) ? slot : null
}

/**
 * High contrast picks white or black against the surface luminance, so its result is not a token.
 * It emits a per-theme `--sdn-hc-on-{slot}` variable for each referenceable surface swatch, and a
 * node contrasting against one of those surfaces references it. An anchored layer with opacity
 * below 50% is dominated by what is underneath, so the reference follows the backdrop slot
 * instead, mirroring how core composites the tint over the backdrop before choosing. A
 * non-referenceable swatch falls back to the baked literal.
 */
export const highContrastStrategy: ComputedVariableStrategy = {
  reference({ context }) {
    const basedOn = resolveHighContrastSource()
    const { value, facetSource } = resolveBasedOnWithAnchor(basedOn, context)

    const slot = referenceableSlotFromValue(value)
    if (!slot) return null

    if (facetSource && basedOn.endsWith(".color")) {
      const opacity = readAnchoredLayerPercentage(
        facetSource,
        basedOn,
        "opacity",
      )
      if (opacity && opacity.value.value < BACKDROP_DOMINANT_OPACITY) {
        const backdrop = resolveBasedOnWithAnchor(
          "#parent.background.color",
          facetSource,
        )
        const backdropSlot = referenceableSlotFromValue(backdrop.value)
        if (!backdropSlot) return null
        return `var(${highContrastVarName(backdropSlot)})`
      }

      // A brightness shift changes the surface luminance, so the pick follows a
      // variable keyed by the shifted color rather than the raw slot.
      const brightness = readAnchoredLayerPercentage(
        facetSource,
        basedOn,
        "brightness",
      )
      if (brightness && brightness.value.value !== 0) {
        recordBrightnessSwatch(slot, brightness.value.value)
        return `var(${highContrastBrightnessVarName(slot, brightness.value.value)})`
      }
    }

    return `var(${highContrastVarName(slot)})`
  },

  emit(theme) {
    return emitHighContrastVariables(theme)
  },
}

/**
 * Emits one `--sdn-hc-on-{slot}` line per referenceable surface swatch for one target appearance,
 * plus one `--sdn-hc-on-{slot}-{brightness}` line per brightness-shifted surface used this export.
 * Each pick is evaluated against the color the surface actually serves in that appearance, taken
 * from `getModeSwatches`: the authored color when the target matches the authored mode, the
 * swapped partner for paired neutrals in dark, and the chroma-derived color otherwise. A shifted
 * surface applies its brightness to that color before the pick.
 */
export function emitHighContrastVariables(
  theme: Theme,
  targetMode?: ThemeMode,
): string {
  const authoredMode = theme.displayMode.parameters.mode ?? "light"
  const mode = targetMode ?? authoredMode
  const modeSwatches = getModeSwatches(theme, mode)

  const contrastForSurface = (
    surface: (typeof modeSwatches)[string],
  ): string => {
    const foreground = resolveHighContrastForeground(
      { type: ValueType.EXACT, value: surface },
      theme,
    )
    return getColorCSSValue({
      color: foreground as ColorValue,
      theme,
      useThemeVariableReferences: false,
    })
  }

  let out = "  /* High Contrast */\n"
  for (const slot of REFERENCEABLE_SWATCH_SLOTS) {
    const surface = modeSwatches[slot]
    if (!surface) continue
    out += `  ${highContrastVarName(slot)}: ${contrastForSurface(surface)};\n`
  }

  // A brightness-shifted surface has its own luminance, so its contrast pick is
  // baked against the brightened color and keyed by the same `(slot, brightness)`
  // pair the swatch variable uses.
  for (const { slot, brightness } of getBrightnessSwatches()) {
    const surface = modeSwatches[slot]
    if (!surface) continue
    const shifted = applyBrightness(surface, brightness)
    out += `  ${highContrastBrightnessVarName(slot, brightness)}: ${contrastForSurface(shifted)};\n`
  }
  return out
}
