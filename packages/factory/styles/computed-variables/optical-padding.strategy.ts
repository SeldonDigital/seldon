import { ValueType } from "@seldon/core"
import { modulate, round } from "@seldon/core/helpers/math"
import {
  getBasedOnValue,
  resolveOpticalPaddingSource,
} from "@seldon/core/properties/compute"
import { isModulatedToken } from "@seldon/core/themes/values"

import {
  RhythmSide,
  opticalPaddingVarName,
  parseThemeOrdinal,
  rhythmSideForFacet,
} from "./names"
import { ComputedVariableStrategy } from "./types"

/**
 * Optical padding multiplies a `@fontSize` source token by the theme's side rhythm, so its result
 * is a derived rem literal per side. It emits `--sdn-cmp-optical-padding-{side}-{step}` for each
 * rhythm side and font-size token, mirroring the `THEME_ORDINAL` branch of `computeOpticalPadding`.
 * The reference maps the padding facet (top and bottom share the vertical rhythm) to its side.
 */
export const opticalPaddingStrategy: ComputedVariableStrategy = {
  reference({ context, keys }) {
    let basedOnValue
    try {
      basedOnValue = getBasedOnValue(resolveOpticalPaddingSource(context), context)
    } catch {
      return null
    }

    if (basedOnValue.type !== ValueType.THEME_ORDINAL) return null

    const parsed = parseThemeOrdinal(String(basedOnValue.value))
    if (!parsed || parsed.scale !== "fontSize") return null

    const side = rhythmSideForFacet(keys?.subPropertyKey)
    return `var(${opticalPaddingVarName(side, parsed.key)})`
  },

  emit(theme) {
    const { ratio, baseFontSize } = theme.modulation.parameters
    const base = baseFontSize / 16
    const { leftRhythm, rightRhythm, verticalRhythm } =
      theme.opticalPadding.parameters

    const sides: Array<[RhythmSide, number]> = [
      ["left", leftRhythm],
      ["right", rightRhythm],
      ["vertical", verticalRhythm],
    ]

    let out = "  /* Optical Padding */\n"
    for (const [side, rhythm] of sides) {
      for (const [key, token] of Object.entries(theme.fontSize)) {
        if (!token || !isModulatedToken(token)) continue
        const value = round(
          modulate(
            { ratio, size: base, step: token.parameters.step },
            { round: false },
          ) * rhythm,
        )
        out += `  ${opticalPaddingVarName(side, key)}: ${value}rem;\n`
      }
    }
    return out
  },
}
