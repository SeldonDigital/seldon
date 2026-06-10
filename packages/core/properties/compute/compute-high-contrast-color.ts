import { convertAndApplyBrightness } from "../../helpers/color/apply-brightness"
import { isDarkBackgroundColor } from "../../helpers/color/contrast"
import { themeSwatchToColorValue } from "../../helpers/color/theme-swatch-to-color-value"
import { resolveColor } from "../../helpers/resolution/resolve-color"
import { resolveValue } from "../../helpers/resolution/resolve-value"
import { getThemeOption } from "../../helpers/theme/get-theme-option"
import type { ThemeSwatch } from "../../themes/types"
import { ComputedFunction, ValueType } from "../constants"
import type { AtomicValue } from "../types/value-atomic"
import type { ColorValue } from "../values/appearance/color"
import type { BasedOnPropertyKey } from "../values/shared/computed/based-on-property-key"
import type { ComputedHighContrastValue } from "../values/shared/computed/high-contrast-color"
import type { EmptyValue } from "../values/shared/empty/empty"
import type { HexValue } from "../values/shared/exact/hex"
import type { PercentageValue } from "../values/shared/exact/percentage"
import { getBasedOnValue } from "./get-based-on-value"
import { ComputeContext } from "./types"

/** Editor label for `ComputedFunction.HIGH_CONTRAST_COLOR`. */
export const HIGH_CONTRAST_COLOR_DISPLAY_NAME = "High Contrast"

/**
 * Reference surface used when `basedOn` cannot be resolved, matching the browser default
 * rendering for an HTML page.
 */
const FALLBACK_SURFACE_COLOR: HexValue = {
  type: ValueType.EXACT,
  value: "#FFFFFF",
}

/**
 * Reads the color at `basedOn`, optionally reads a sibling `.brightness` when `basedOn` ends with
 * `.color`, resolves through the theme, then returns the theme’s white or black swatch so text reads
 * on that background. `basedOn` is required on the stored value (typically `#parent.background.color`
 * for foreground-on-surface). When the path misses (for example a root node with no parent context)
 * or resolves to an empty or transparent color, the reference surface falls back to pure white.
 *
 * @param value - Stored computed high-contrast value
 * @param context - Theme and contexts for resolution
 * @returns `EXACT` string taken from `@swatch.white` or `@swatch.black` on the theme
 */
export function computeHighContrastColor(
  value: ComputedHighContrastValue,
  context: ComputeContext,
) {
  const basedOnValue = maybeGetBasedOnValue(value, context)

  const brightness = maybeGetBrightness(value, context)

  const resolved = resolveValue(
    resolveColor({
      color: basedOnValue as ColorValue,
      theme: context.theme,
    }),
  )

  const surface =
    !resolved || resolved.value === "transparent"
      ? FALLBACK_SURFACE_COLOR
      : resolved

  const color =
    brightness && surface.type === ValueType.EXACT
      ? {
          type: ValueType.EXACT as const,
          value: convertAndApplyBrightness(
            surface.value,
            brightness.value.value,
          ),
        }
      : surface

  const isDark = isDarkBackgroundColor(color)

  const themeOption = getThemeOption(
    isDark ? "@swatch.white" : "@swatch.black",
    context.theme,
  ) as ThemeSwatch

  return themeSwatchToColorValue(themeOption)
}

/**
 * Resolves `basedOn`, returning the white fallback surface when the path cannot be resolved, such
 * as a root node with no parent context.
 */
function maybeGetBasedOnValue(
  value: ComputedHighContrastValue,
  context: ComputeContext,
): AtomicValue {
  try {
    return getBasedOnValue(value, context)
  } catch {
    return FALLBACK_SURFACE_COLOR
  }
}

/**
 * Builds a temporary `basedOn` by swapping the trailing `.color` segment to `.brightness`, resolves
 * it, and returns the percentage when present. Returns undefined when the path is missing or not
 * resolvable.
 */
function maybeGetBrightness(
  value: ComputedHighContrastValue,
  context: ComputeContext,
): PercentageValue | undefined {
  try {
    const brightnessBasedOnValue: ComputedHighContrastValue = {
      ...value,
      value: {
        function: ComputedFunction.HIGH_CONTRAST_COLOR,
        input: {
          basedOn: value.value.input.basedOn.replace(
            ".color",
            ".brightness",
          ) as BasedOnPropertyKey,
        },
      },
    }

    const brightnessValue = getBasedOnValue(brightnessBasedOnValue, context) as
      | PercentageValue
      | EmptyValue

    return resolveValue(brightnessValue)
  } catch {
    return undefined
  }
}
