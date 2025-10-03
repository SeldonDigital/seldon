import { modulate } from "../helpers/math/modulate"
import { round } from "../helpers/math/round"
import { getThemeOption } from "../helpers/theme/get-theme-option"
import { isUnitValue } from "../helpers/type-guards/value/is-unit-value"
import { invariant } from "../helpers/utils/invariant"
import { ThemeModulation, ThemeValueKey, Unit, ValueType } from "../index"
import { SubPropertyKey } from "../properties/types/properties"
import { ComputedOpticalPaddingValue } from "../properties/values/computed/optical-padding"
import { getBasedOnValue } from "./get-based-on-value"
import { ComputeContext, ComputeKeys } from "./types"

const LEFT_PADDING_RATIO = 0.64
const RIGHT_PADDING_RATIO = 0.8
const Y_PADDING_RATIO = 0.4

/**
 * Computes visually balanced padding values based on typography and design principles.
 * Uses different ratios for different sides to create optical balance.
 *
 * @param value - The computed optical padding value with basedOn reference and factor
 * @param context - The computation context containing theme and parent data
 * @param keys - The computation keys containing sub-property information
 * @returns An exact padding value with optical balance applied
 */
export function computeOpticalPadding(
  value: ComputedOpticalPaddingValue,
  context: ComputeContext,
  keys: ComputeKeys,
) {
  const basedOnValue = getBasedOnValue(value, context)
  const ratio = getRatio(keys.subPropertyKey)

  if (basedOnValue.type === ValueType.EXACT) {
    if (typeof basedOnValue.value === "number") {
      return {
        ...basedOnValue,
        value: round(basedOnValue.value * ratio * value.value.input.factor),
      }
    }

    if (isUnitValue(basedOnValue)) {
      return {
        ...basedOnValue,
        value: {
          ...basedOnValue.value,
          value: round(
            basedOnValue.value.value * ratio * value.value.input.factor,
          ),
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
      `Optical padding only supports fontSize theme values, got: ${basedOnValue.value}`,
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
    `Failed to compute optical padding from ${JSON.stringify(basedOnValue)}`,
  )
}

/**
 * Get the optical padding ratio for a specific side
 *
 * @param side - The padding side (left, right, top, bottom)
 * @returns The ratio multiplier for optical balance
 */
function getRatio(side?: SubPropertyKey) {
  switch (side) {
    case "left":
      return LEFT_PADDING_RATIO
    case "right":
      return RIGHT_PADDING_RATIO
    case "top":
      return Y_PADDING_RATIO
    case "bottom":
      return Y_PADDING_RATIO
    default:
      return LEFT_PADDING_RATIO
  }
}
