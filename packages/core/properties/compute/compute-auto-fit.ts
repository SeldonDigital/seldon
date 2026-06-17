import { modulate, round } from "../../helpers/math"
import { getThemeOption } from "../../helpers/theme/get-theme-option"
import { isUnitValue } from "../../helpers/type-guards/value/is-unit-value"
import { invariant } from "../../helpers/utils/invariant"
import type { ThemeModulation, ThemeValueKey } from "../../themes/types"
import { Unit, ValueType } from "../constants"
import type { ComputedAutoFitValue } from "../values/shared/computed/auto-fit"
import { getBasedOnValue } from "./get-based-on-value"
import { ComputeContext } from "./types"

/** Editor label for `ComputedFunction.AUTO_FIT`. */
export const AUTO_FIT_DISPLAY_NAME = "Auto Fit"

/**
 * Scales the value at `basedOn` by `factor`, using defaults when those inputs are missing.
 * Missing `basedOn` becomes `#parent.buttonSize`. Missing `factor` becomes `1`.
 *
 * Supported resolved based-on types: `EXACT` number, `EXACT` length with `unit` and `value`, or
 * `THEME_ORDINAL` only when the token string uses the `@fontSize` prefix. Resolves other types by
 * throwing.
 *
 * @param value - Stored computed auto-fit value
 * @param context - Theme and contexts for `getBasedOnValue`
 * @returns `EXACT` number, `EXACT` length, or `EXACT` rem from font size modulation
 * @throws When the resolved based-on is not supported
 */
export function computeAutoFit(
  value: ComputedAutoFitValue,
  context: ComputeContext,
) {
  const basedOn = value.value.input.basedOn || "#parent.buttonSize"
  const factor = value.value.input.factor ?? 1.0

  const valueWithDefaults = {
    ...value,
    value: {
      ...value.value,
      input: { basedOn, factor },
    },
  }

  const basedOnValue = getBasedOnValue(valueWithDefaults, context)

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
              ratio: context.theme.core.ratio,
              size: context.theme.core.fontSize / 16,
              step: themeOption.parameters.step,
            },
            { round: false },
          ) * factor,
        ),
      },
    }
  }

  throw new Error(
    `Failed to compute auto fit from ${JSON.stringify(basedOnValue)}`,
  )
}
