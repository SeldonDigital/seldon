import { modulate, round } from "../../helpers/math"
import { getThemeOption } from "../../helpers/theme/get-theme-option"
import { isUnitValue } from "../../helpers/type-guards/value/is-unit-value"
import { invariant } from "../../helpers/utils/invariant"
import type { ThemeModulation, ThemeValueKey } from "../../themes/types"
import { EMPTY_VALUE, Unit, ValueType } from "../constants"
import type { ComputedAutoFitValue } from "../values/shared/computed/auto-fit"
import { getBasedOnValue } from "./get-based-on-value"
import { ComputeContext } from "./types"

/** Editor label for `ComputedFunction.AUTO_FIT`. */
export const AUTO_FIT_DISPLAY_NAME = "Auto Fit"

/**
 * Scales the value at `basedOn` by the theme's `autoFit` factor. Missing `basedOn` becomes
 * `#parent.buttonSize`. The factor is a theme Computed value and is not authored per schema.
 *
 * Supported resolved based-on types: `EXACT` number, `EXACT` length with `unit` and `value`, or
 * `THEME_ORDINAL` only when the token string uses the `@fontSize` prefix. Degrades to `EMPTY` when
 * the `basedOn` path cannot be resolved or resolves to an unsupported type, so an unresolved input
 * never breaks compute or CSS generation.
 *
 * @param value - Stored computed auto-fit value
 * @param context - Theme and contexts for `getBasedOnValue`
 * @returns `EXACT` number, `EXACT` length, `EXACT` rem from font size modulation, or `EMPTY`
 */
export function computeAutoFit(
  value: ComputedAutoFitValue,
  context: ComputeContext,
) {
  const basedOn = value.value.input.basedOn || "#parent.buttonSize"
  const factor = context.theme.autoFit.parameters.factor

  const valueWithDefaults = {
    ...value,
    value: {
      ...value.value,
      input: { basedOn },
    },
  }

  let basedOnValue
  try {
    basedOnValue = getBasedOnValue(valueWithDefaults, context)
  } catch {
    return EMPTY_VALUE
  }

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
    invariant(
      basedOnValue.value.includes("@fontSize"),
      `Auto fit only supports @fontSize theme ordinals, got: ${basedOnValue.value}`,
    )

    const themeOption = getThemeOption(
      basedOnValue.value as ThemeValueKey,
      context.theme,
    ) as ThemeModulation

    invariant(themeOption, `Theme option not found for ${basedOnValue.value}`)

    return {
      type: ValueType.EXACT,
      value: {
        unit: Unit.REM,
        value: round(
          modulate(
            {
              ratio: context.theme.modulation.parameters.ratio,
              size: context.theme.modulation.parameters.baseFontSize / 16,
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
