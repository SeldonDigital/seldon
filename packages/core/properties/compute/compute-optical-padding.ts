import { modulate, round } from "../../helpers/math"
import { getThemeOption } from "../../helpers/theme/get-theme-option"
import { isUnitValue } from "../../helpers/type-guards/value/is-unit-value"
import { invariant } from "../../helpers/utils/invariant"
import type { ThemeModulation, ThemeValueKey } from "../../themes/types"
import { EMPTY_VALUE, Unit, ValueType } from "../constants"
import type { SubPropertyKey } from "../types/property-keys"
import type { ComputedOpticalPaddingValue } from "../values/shared/computed/optical-padding"
import { getBasedOnValue } from "./get-based-on-value"
import { resolveOpticalPaddingSource } from "./resolve-optical-padding-source"
import { ComputeContext, ComputeKeys } from "./types"

/**
 * Multiplies the resolved source length by the theme's side rhythm for the padding side named in
 * `keys.subPropertyKey`. The source is derived from self first: `#buttonSize`, else `#font.size`,
 * else the parent fallback `#parent.fontSize` (see {@link resolveOpticalPaddingSource}). The side
 * rhythms are theme Computed values and are not authored per schema.
 *
 * Supported resolved source types: `EXACT` number, `EXACT` length with `unit` and `value`, or
 * `THEME_ORDINAL` only when the token string uses the `@fontSize` prefix. Degrades to `EMPTY` when
 * the source path cannot be resolved or resolves to an unsupported type, so an unresolved input
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
  const basedOn = resolveOpticalPaddingSource(context)

  let basedOnValue
  try {
    basedOnValue = getBasedOnValue(basedOn, context)
  } catch {
    return EMPTY_VALUE
  }
  const ratio = getRatio(keys.subPropertyKey, context.theme.opticalPadding.parameters)

  if (basedOnValue.type === ValueType.EXACT) {
    if (typeof basedOnValue.value === "number") {
      return {
        ...basedOnValue,
        value: round(basedOnValue.value * ratio),
      }
    }

    if (isUnitValue(basedOnValue)) {
      return {
        ...basedOnValue,
        value: {
          ...basedOnValue.value,
          value: round(basedOnValue.value.value * ratio),
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
          ) * ratio,
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
