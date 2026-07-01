import { ValueType } from "@seldon/core"
import { modulate, round } from "@seldon/core/helpers/math"
import { resolveAutoFitSource } from "@seldon/core/properties/compute"
import type { Theme, ThemeScaleToken } from "@seldon/core/themes/types"
import { isModulatedToken } from "@seldon/core/themes/values"

import { autoFitVarName, parseThemeOrdinal } from "./names"
import { ComputedVariableStrategy } from "./types"

/**
 * Auto fit scales a `@fontSize` or `@size` source token by the theme's `autoFit.factor`, so its
 * result is a derived rem literal. It emits `--sdn-cmp-auto-fit-{scale}-{step}` for every font-size
 * and size token, mirroring the `THEME_ORDINAL` branch of `computeAutoFit` so the value matches the
 * canvas. A node whose source is an authored literal keeps the baked literal.
 */
export const autoFitStrategy: ComputedVariableStrategy = {
  reference({ context }) {
    const source = resolveAutoFitSource(context)
    if (source.type !== ValueType.THEME_ORDINAL) return null

    const parsed = parseThemeOrdinal(String(source.value))
    if (!parsed || (parsed.scale !== "fontSize" && parsed.scale !== "size")) {
      return null
    }

    return `var(${autoFitVarName(parsed.scale, parsed.key)})`
  },

  emit(theme) {
    const { ratio, baseFontSize, baseSize } = theme.modulation.parameters
    const factor = theme.autoFit.parameters.factor

    let out = "  /* Auto Fit */\n"
    out += emitScale(
      theme,
      "fontSize",
      theme.fontSize,
      baseFontSize / 16,
      ratio,
      factor,
    )
    out += emitScale(theme, "size", theme.size, baseSize, ratio, factor)
    return out
  },
}

function emitScale(
  _theme: Theme,
  scale: "fontSize" | "size",
  table: Record<string, ThemeScaleToken | undefined>,
  base: number,
  ratio: number,
  factor: number,
): string {
  let out = ""
  for (const [key, token] of Object.entries(table)) {
    if (!token || !isModulatedToken(token)) continue
    const value = round(
      modulate(
        { ratio, size: base, step: token.parameters.step },
        { round: false },
      ) * factor,
    )
    out += `  ${autoFitVarName(scale, key)}: ${value}rem;\n`
  }
  return out
}
