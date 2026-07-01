import { ColorValue, ValueType } from "@seldon/core"
import { themeSwatchToColorValue } from "@seldon/core/helpers/color/theme-swatch-to-color-value"
import {
  readAnchoredLayerPercentage,
  resolveBasedOnWithAnchor,
  resolveHighContrastForeground,
  resolveHighContrastSource,
} from "@seldon/core/properties/compute"
import type { ThemeSwatch } from "@seldon/core/themes/types"

import { getColorCSSValue } from "../css-properties/get-color-css-value"
import {
  REFERENCEABLE_SWATCH_SLOTS,
  highContrastVarName,
  swatchIdFromRef,
} from "./names"
import { ComputedVariableStrategy } from "./types"

/**
 * High contrast picks white or black against the surface luminance, so its result is not a token.
 * It emits a per-theme `--sdn-hc-on-{slot}` variable for each referenceable surface swatch, and a
 * node contrasting against one of those surfaces references it. A surface with a brightness or
 * opacity transform, or a non-referenceable swatch, falls back to the baked literal.
 */
export const highContrastStrategy: ComputedVariableStrategy = {
  reference({ context }) {
    const basedOn = resolveHighContrastSource()
    const { value, facetSource } = resolveBasedOnWithAnchor(basedOn, context)

    if (
      !value ||
      typeof value !== "object" ||
      !("type" in value) ||
      value.type !== ValueType.THEME_CATEGORICAL
    ) {
      return null
    }

    const slot = swatchIdFromRef(String(value.value))
    if (!slot || !REFERENCEABLE_SWATCH_SLOTS.has(slot)) return null

    // A brightness or non-full opacity on the anchored surface layer changes the
    // luminance the decision is made against, so the plain-slot variable would be
    // wrong. Fall back to the baked literal in that case.
    if (facetSource && basedOn.endsWith(".color")) {
      const brightness = readAnchoredLayerPercentage(
        facetSource,
        basedOn,
        "brightness",
      )
      if (brightness && brightness.value.value !== 0) return null
      const opacity = readAnchoredLayerPercentage(facetSource, basedOn, "opacity")
      if (opacity && opacity.value.value !== 100) return null
    }

    return `var(${highContrastVarName(slot)})`
  },

  emit(theme) {
    let out = "  /* High Contrast */\n"
    for (const slot of REFERENCEABLE_SWATCH_SLOTS) {
      const swatch = theme.swatch[slot as keyof typeof theme.swatch] as
        | ThemeSwatch
        | undefined
      if (!swatch) continue
      const foreground = resolveHighContrastForeground(
        themeSwatchToColorValue(swatch),
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
  },
}
