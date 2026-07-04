import { ColorValue, ValueType } from "@seldon/core"
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
  REFERENCEABLE_SWATCH_SLOTS,
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
    }

    return `var(${highContrastVarName(slot)})`
  },

  emit(theme) {
    return emitHighContrastVariables(theme)
  },
}

/**
 * Emits one `--sdn-hc-on-{slot}` line per referenceable surface swatch for one target appearance.
 * Each pick is evaluated against the color the slot actually serves in that appearance, taken
 * from `getModeSwatches`: the authored color when the target matches the authored mode, the
 * swapped partner for paired neutrals in dark, and the chroma-derived color otherwise.
 */
export function emitHighContrastVariables(
  theme: Theme,
  targetMode?: ThemeMode,
): string {
  const authoredMode = theme.colorHarmony.parameters.mode ?? "light"
  const mode = targetMode ?? authoredMode
  const modeSwatches = getModeSwatches(theme, mode)

  let out = "  /* High Contrast */\n"
  for (const slot of REFERENCEABLE_SWATCH_SLOTS) {
    const surface = modeSwatches[slot]
    if (!surface) continue
    const foreground = resolveHighContrastForeground(
      { type: ValueType.EXACT, value: surface },
      theme,
    )
    const css = getColorCSSValue({
      color: foreground as ColorValue,
      theme,
      useThemeVariableReferences: false,
    })
    out += `  ${highContrastVarName(slot)}: ${css};\n`
  }
  return out
}
