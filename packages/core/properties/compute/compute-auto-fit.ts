import { modulate, round } from "../../helpers/math"
import { getThemeOption } from "../../helpers/theme/get-theme-option"
import { isUnitValue } from "../../helpers/type-guards/value/is-unit-value"
import { invariant } from "../../helpers/utils/invariant"
import type { ThemeModulation, ThemeValueKey } from "../../themes/types"
import { EMPTY_VALUE, Unit, ValueType } from "../constants"
import type { ComputedAutoFitValue } from "../values/shared/computed/auto-fit"
import { resolveAutoFitSource } from "./resolve-auto-fit-source"
import { ComputeContext } from "./types"

/**
 * Scales the ancestor size token by the theme's `autoFit` factor. The source is resolved by walking
 * the ancestor chain for `buttonSize`, then `size`, then the `@fontSize.medium` fallback (see
 * {@link resolveAutoFitSource}). The factor is a theme Computed value and is not authored per schema.
 *
 * Supported source types: `EXACT` number, `EXACT` length with `unit` and `value`, or a
 * `THEME_ORDINAL` using the `@fontSize` or `@size` prefix. Degrades to `EMPTY` when the source
 * resolves to an unsupported type, so an unresolved input never breaks compute or CSS generation.
 *
 * @param value - Stored computed auto-fit value
 * @param context - Theme and contexts for the ancestor walk
 * @returns `EXACT` number, `EXACT` length, `EXACT` rem from size modulation, or `EMPTY`
 */
export function computeAutoFit(
  value: ComputedAutoFitValue,
  context: ComputeContext,
) {
  const factor = context.theme.autoFit.parameters.factor
  const basedOnValue = resolveAutoFitSource(context)

  if (basedOnValue.type === ValueType.EXACT) {
    if (typeof basedOnValue.value === "number") {
      return {
        ...basedOnValue,
        value: round(basedOnValue.value * factor),
      }
    }

    if (isUnitValue(basedOnValue)) {
      return {
        ...basedOnValue,
        value: {
          ...basedOnValue.value,
          value: round(basedOnValue.value.value * factor),
        },
      }
    }
  }

  if (basedOnValue.type === ValueType.THEME_ORDINAL) {
    const token = basedOnValue.value as string
    const isFontSize = token.includes("@fontSize")
    const isSize = token.includes("@size")

    invariant(
      isFontSize || isSize,
      `Auto fit only supports @fontSize or @size theme ordinals, got: ${token}`,
    )

    const themeOption = getThemeOption(
      token as ThemeValueKey,
      context.theme,
    ) as ThemeModulation

    invariant(themeOption, `Theme option not found for ${token}`)

    const baseSize = isFontSize
      ? context.theme.modulation.parameters.baseFontSize / 16
      : context.theme.modulation.parameters.baseSize

    return {
      type: ValueType.EXACT,
      value: {
        unit: Unit.REM,
        value: round(
          modulate(
            {
              ratio: context.theme.modulation.parameters.ratio,
              size: baseSize,
              step: themeOption.parameters.step,
            },
            { round: false },
          ) * factor,
        ),
      },
    }
  }

  return EMPTY_VALUE
}
