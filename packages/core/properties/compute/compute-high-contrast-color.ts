import { convertAndApplyBrightness } from "../../helpers/color/apply-brightness"
import { isDarkBackgroundColor } from "../../helpers/color/contrast"
import { themeSwatchToColorValue } from "../../helpers/color/theme-swatch-to-color-value"
import { resolveColor } from "../../helpers/resolution/resolve-color"
import { resolveValue } from "../../helpers/resolution/resolve-value"
import { getThemeOption } from "../../helpers/theme/get-theme-option"
import { isCompoundValue } from "../../helpers/type-guards/compound/is-compound-value"
import { InvariantError } from "../../helpers/utils/invariant"
import type { ThemeSwatch } from "../../themes/types"
import { ValueType } from "../constants"
import type { AtomicValue } from "../types/value-atomic"
import type { ColorValue } from "../values/appearance/color"
import type { ComputedHighContrastValue } from "../values/shared/computed/high-contrast-color"
import type { Hex, HexValue } from "../values/shared/exact/hex"
import type { HSL } from "../values/shared/exact/hsl"
import type { LCH } from "../values/shared/exact/lch"
import type { PercentageValue } from "../values/shared/exact/percentage"
import type { RGB } from "../values/shared/exact/rgb"
import {
  applyLayerOpacity,
  readAnchoredLayerPercentage,
} from "./compute-layer-color"
import { resolveBasedOnWithAnchor } from "./get-based-on-value"
import { parseBasedOnPath } from "./parse-based-on-path"
import { resolveHighContrastSource } from "./resolve-high-contrast-source"
import { ComputeContext } from "./types"

/**
 * Reads the color at `basedOn`, optionally reads sibling `.brightness` and `.opacity` on the same
 * background layer where the color walk stopped, resolves through the theme, then returns the
 * theme's white or black swatch so text reads on that background. Sibling facets do not walk to
 * grandparents when empty on the anchored layer. The source is `#self.background.color`: it reads
 * the node's own background first and walks ancestors while the layer is empty or transparent. When
 * the path misses or resolves to an empty or transparent color, the reference surface falls back to
 * pure white.
 *
 * @param value - Stored computed high-contrast value
 * @param context - Theme and contexts for resolution
 * @returns `EXACT` string taken from `@swatch.white` or `@swatch.black` on the theme
 */
export function computeHighContrastColor(
  value: ComputedHighContrastValue,
  context: ComputeContext,
) {
  const { fallbackColor } = context.theme.highContrast.parameters

  const { basedOnValue, brightness, opacity, backdrop } =
    resolveHighContrastInputs(context, fallbackColor)

  const resolved = resolveValue(
    resolveColor({
      color: basedOnValue as ColorValue,
      theme: context.theme,
    }),
  )

  const surface =
    !resolved || resolved.value === "transparent" ? fallbackColor : resolved

  let color: ColorValue | HexValue = surface

  if (brightness && surface.type === ValueType.EXACT) {
    color = {
      type: ValueType.EXACT as const,
      value: convertAndApplyBrightness(
        surface.value as Hex,
        brightness.value.value,
      ),
    }
  }

  if (opacity && color.type === ValueType.EXACT) {
    color = applyLayerOpacity(
      color.value as HSL | LCH | RGB | Hex,
      opacity.value.value,
      backdrop,
    )
  }

  return resolveHighContrastForeground(color, context.theme)
}

/**
 * Given a resolved surface color, returns the readable foreground swatch for it against `theme`.
 * With bleed, returns the theme's white or black swatch (which carries the hue bleed). Without
 * bleed, builds a neutral white or black from the color-harmony white/black points with zero
 * saturation. The white/black choice comes from the surface luminance against the theme contrast
 * ratio. This is the theme-parameterized core of high contrast, shared by the compute engine and by
 * factory export so a theme can bake its own answer per surface.
 *
 * @param surface - Resolved surface color the foreground must read on
 * @param theme - Theme supplying contrast ratio, bleed, harmony, and white/black swatches
 * @returns `EXACT` foreground color taken from `@swatch.white`/`@swatch.black` or the harmony points
 */
export function resolveHighContrastForeground(
  surface: ColorValue | HexValue,
  theme: ComputeContext["theme"],
): ColorValue | HexValue {
  const { contrastRatio, includeBleed } = theme.highContrast.parameters

  const isDark = isDarkBackgroundColor(surface, contrastRatio)

  if (includeBleed) {
    const themeOption = getThemeOption(
      isDark ? "@swatch.white" : "@swatch.black",
      theme,
    ) as ThemeSwatch
    return themeSwatchToColorValue(themeOption)
  }

  const harmony = theme.colorHarmony.parameters
  return {
    type: ValueType.EXACT as const,
    value: {
      hue: 0,
      saturation: 0,
      lightness: isDark ? harmony.whitePoint : harmony.blackPoint,
    },
  }
}

function resolveHighContrastInputs(
  context: ComputeContext,
  fallbackColor: ColorValue,
): {
  basedOnValue: AtomicValue
  brightness: PercentageValue | undefined
  opacity: PercentageValue | undefined
  backdrop: HSL | LCH | RGB | Hex | undefined
} {
  const basedOn = resolveHighContrastSource()

  try {
    const { value: resolvedValue, facetSource } = resolveBasedOnWithAnchor(
      basedOn,
      context,
    )

    // A `basedOn` color that is still `COMPUTED` (e.g. the surface uses `MATCH_COLOR`)
    // has no resolvable color yet, so fall back to the reference surface instead
    // of handing a computed value to `resolveColor`, which cannot resolve it.
    if (
      !resolvedValue ||
      isCompoundValue(resolvedValue) ||
      (resolvedValue as { type?: ValueType }).type === ValueType.COMPUTED
    ) {
      return {
        basedOnValue: fallbackColor as AtomicValue,
        brightness: undefined,
        opacity: undefined,
        backdrop: undefined,
      }
    }

    const basedOnValue = resolvedValue as AtomicValue

    if (!facetSource || !basedOn.endsWith(".color")) {
      return {
        basedOnValue,
        brightness: undefined,
        opacity: undefined,
        backdrop: undefined,
      }
    }

    const opacity = readAnchoredLayerPercentage(facetSource, basedOn, "opacity")

    return {
      basedOnValue,
      brightness: readAnchoredLayerPercentage(
        facetSource,
        basedOn,
        "brightness",
      ),
      opacity,
      backdrop: opacity
        ? resolveBackdropColor(basedOn, facetSource, context.theme)
        : undefined,
    }
  } catch (error) {
    // An unresolved source falls back to the reference surface; an invariant
    // violation is an authoring bug and must surface.
    if (error instanceof InvariantError) throw error
    return {
      basedOnValue: fallbackColor as AtomicValue,
      brightness: undefined,
      opacity: undefined,
      backdrop: undefined,
    }
  }
}

/**
 * Resolves the opaque-or-deeper surface beneath the anchored translucent layer so opacity
 * composites against the real backdrop instead of the white reference surface. Continues the
 * `#parent` color walk from the anchored layer's parent and returns its resolved color, or
 * `undefined` when no contributing backdrop exists.
 */
function resolveBackdropColor(
  basedOn: string,
  facetSource: Omit<ComputeContext, "theme">,
  theme: ComputeContext["theme"],
): HSL | LCH | RGB | Hex | undefined {
  if (!facetSource.parentContext) {
    return undefined
  }

  const parentBasedOn = basedOn.startsWith("#parent.")
    ? basedOn
    : `#parent.${parseBasedOnPath(basedOn).lookupPath}`

  const { value } = resolveBasedOnWithAnchor(parentBasedOn, facetSource)

  if (
    !value ||
    isCompoundValue(value) ||
    (value as { type?: ValueType }).type === ValueType.COMPUTED
  ) {
    return undefined
  }

  const resolved = resolveValue(
    resolveColor({ color: value as ColorValue, theme }),
  )

  if (!resolved || resolved.value === "transparent") {
    return undefined
  }

  return resolved.value as HSL | LCH | RGB | Hex
}
