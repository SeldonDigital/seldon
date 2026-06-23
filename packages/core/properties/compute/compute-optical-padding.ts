import { modulate, round } from "../../helpers/math"
import { getThemeOption } from "../../helpers/theme/get-theme-option"
import { isUnitValue } from "../../helpers/type-guards/value/is-unit-value"
import { invariant } from "../../helpers/utils/invariant"
import type { ThemeModulation, ThemeValueKey } from "../../themes/types"
import { EMPTY_VALUE, Unit, ValueType } from "../constants"
import type { SubPropertyKey } from "../types/property-keys"
import type { ComputedOpticalPaddingValue } from "../values/shared/computed/optical-padding"
import { getBasedOnValue } from "./get-based-on-value"
import { ComputeContext, ComputeKeys } from "./types"

/** Editor label for `ComputedFunction.OPTICAL_PADDING`. */
export const OPTICAL_PADDING_DISPLAY_NAME = "Optical Padding"

/**
 * Multiplies the resolved based-on length by `factor` and by a fixed ratio for the padding side
 * named in `keys.subPropertyKey`. Missing `basedOn` becomes `#parent.fontSize`. Missing `factor`
 * becomes `1.5`.
 *
 * Supported resolved based-on types: `EXACT` number, `EXACT` length with `unit` and `value`, or
 * `THEME_ORDINAL` only when the token string uses the `@fontSize` prefix. Degrades to `EMPTY` when
 * the `basedOn` path cannot be resolved or resolves to an unsupported type, so an unresolved input
 * never breaks compute or CSS generation.
 *
 * @param value - Stored computed optical padding value
 * @param context - Theme and contexts for `getBasedOnValue`
 * @param keys - Which padding facet is computing, from `propertyKey` and optional `subPropertyKey`
 * @returns `EXACT` number, `EXACT` length, `EXACT` rem from font size modulation, or `EMPTY`
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

  let basedOnValue
  try {
    basedOnValue = getBasedOnValue(valueWithDefaults, context)
  } catch {
    return EMPTY_VALUE
  }
  const ratio = getRatio(keys.subPropertyKey, context.theme.opticalPadding.parameters)

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

/** Maps `subPropertyKey` to the left, right, or vertical rhythm, defaulting to left. */
function getRatio(
  side: SubPropertyKey | undefined,
  rhythm: { leftRhythm: number; rightRhythm: number; verticalRhythm: number },
) {
  switch (side) {
    case "left":
      return rhythm.leftRhythm
    case "right":
      return rhythm.rightRhythm
    case "top":
      return rhythm.verticalRhythm
    case "bottom":
      return rhythm.verticalRhythm
    default:
      return rhythm.leftRhythm
  }
}
