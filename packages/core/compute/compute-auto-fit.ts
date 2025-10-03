import { modulate } from "../helpers/math/modulate"
import { round } from "../helpers/math/round"
import { getThemeOption } from "../helpers/theme/get-theme-option"
import { isUnitValue } from "../helpers/type-guards/value/is-unit-value"
import { invariant } from "../helpers/utils/invariant"
import {
  ComputedAutoFitValue,
  ThemeModulation,
  ThemeValueKey,
  Unit,
  ValueType,
} from "../index"
import { getBasedOnValue } from "./get-based-on-value"
import { ComputeContext } from "./types"

/**
 * Computes a scaled value based on a reference value and factor.
 * Supports exact values (numbers and units) and fontSize theme values.
 *
 * @param value - The computed auto fit value with basedOn reference and factor
 * @param context - The computation context containing theme and parent data
 * @returns An exact value scaled by the factor
 */
export function computeAutoFit(
  value: ComputedAutoFitValue,
  context: ComputeContext,
) {
  const basedOnValue = getBasedOnValue(value, context)

  if (basedOnValue.type === ValueType.EXACT) {
    if (typeof basedOnValue.value === "number") {
      return {
        ...basedOnValue,
        value: round(basedOnValue.value * value.value.input.factor),
      }
    }

    if (isUnitValue(basedOnValue)) {
      return {
        ...basedOnValue,
        value: {
          ...basedOnValue.value,
          value: round(basedOnValue.value.value * value.value.input.factor),
        },
      }
    }
  }

  /**
   * Convert theme ordinal values (fontSize) to exact values using modulation
   */
  if (basedOnValue.type === ValueType.THEME_ORDINAL) {
    invariant(
      basedOnValue.value.includes("@fontSize"),
      `AutoFit only supports fontSize theme values, got: ${basedOnValue.value}`,
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
          ) * value.value.input.factor,
        ),
      },
    }
  }

  throw new Error(
    `Failed to compute auto fit from ${JSON.stringify(basedOnValue)}`,
  )
}
