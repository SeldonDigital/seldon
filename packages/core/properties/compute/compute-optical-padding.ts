import { modulate, round } from "../../helpers/math"
import { getThemeOption } from "../../helpers/theme/get-theme-option"
import { isUnitValue } from "../../helpers/type-guards/value/is-unit-value"
import { invariant } from "../../helpers/utils/invariant"
import type { ThemeModulation, ThemeValueKey } from "../../themes/types"
import { Unit, ValueType } from "../constants"
import type { SubPropertyKey } from "../types/property-keys"
import type { ComputedOpticalPaddingValue } from "../values/shared/computed/optical-padding"
import { getBasedOnValue } from "./get-based-on-value"
import { ComputeContext, ComputeKeys } from "./types"

/** Editor label for `ComputedFunction.OPTICAL_PADDING`. */
export const OPTICAL_PADDING_DISPLAY_NAME = "Optical Padding"

const LEFT_PADDING_RATIO = 0.64
const RIGHT_PADDING_RATIO = 0.8
const Y_PADDING_RATIO = 0.4

/**
 * Multiplies the resolved based-on length by `factor` and by a fixed ratio for the padding side
 * named in `keys.subPropertyKey`. Missing `basedOn` becomes `#parent.fontSize`. Missing `factor`
 * becomes `1.5`.
 *
 * Supported resolved based-on types: `EXACT` number, `EXACT` length with `unit` and `value`, or
 * `THEME_ORDINAL` only when the token string uses the `@fontSize` prefix. Any other based-on shape
 * throws after resolution.
 *
 * @param value - Stored computed optical padding value
 * @param context - Theme and contexts for `getBasedOnValue`
 * @param keys - Which padding facet is computing, from `propertyKey` and optional `subPropertyKey`
 * @returns `EXACT` number, `EXACT` length, or `EXACT` rem from font size modulation
 * @throws When the resolved based-on is not supported
 */
export function computeOpticalPadding(
  value: ComputedOpticalPaddingValue,
  context: ComputeContext,
  keys: ComputeKeys,
) {
  const basedOn = value.value.input.basedOn || "#parent.fontSize"
  const factor = value.value.input.factor ?? 1.5

  const valueWithDefaults = {
    ...value,
    value: {
      ...value.value,
      input: { basedOn, factor },
    },
  }

  const basedOnValue = getBasedOnValue(valueWithDefaults, context)
  const ratio = getRatio(keys.subPropertyKey)

  if (basedOnValue.type === ValueType.EXACT) {
    if (typeof basedOnValue.value === "number") {
      return {
        ...basedOnValue,
        value: round(basedOnValue.value * ratio * factor),
      }
    }

    if (isUnitValue(basedOnValue)) {
      return {
        ...basedOnValue,
        value: {
          ...basedOnValue.value,
          value: round(basedOnValue.value.value * ratio * factor),
        },
      }
    }
  }

  if (basedOnValue.type === ValueType.THEME_ORDINAL) {
    invariant(
      basedOnValue.value.includes("@fontSize"),
      `Optical padding only supports @fontSize theme ordinals, got: ${basedOnValue.value}`,
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
    `Failed to compute optical padding from ${JSON.stringify(basedOnValue)}`,
  )
}

/** Maps `subPropertyKey` to left, right, top, or bottom ratio, or uses the left ratio when missing. */
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
