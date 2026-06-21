import chroma from "chroma-js"

import { convertAndApplyBrightness } from "../../helpers/color/apply-brightness"
import { isDarkBackgroundColor } from "../../helpers/color/contrast"
import { HSLObjectToString } from "../../helpers/color/hsl-object-to-string"
import { LCHObjectToString } from "../../helpers/color/lch-object-to-string"
import { RGBObjectToString } from "../../helpers/color/rgb-object-to-string"
import { themeSwatchToColorValue } from "../../helpers/color/theme-swatch-to-color-value"
import { resolveColor } from "../../helpers/resolution/resolve-color"
import { resolveValue } from "../../helpers/resolution/resolve-value"
import { getThemeOption } from "../../helpers/theme/get-theme-option"
import { isHSLObject } from "../../helpers/type-guards/color/is-hsl-object"
import { isLCHObject } from "../../helpers/type-guards/color/is-lch-object"
import { isRGBObject } from "../../helpers/type-guards/color/is-rgb-object"
import { isCompoundValue } from "../../helpers/type-guards/compound/is-compound-value"
import { findInObject } from "../../helpers/utils/find-in-object"
import { isHex, isHexWithoutHash } from "../../helpers/validation"
import type { ThemeSwatch } from "../../themes/types"
import { ValueType } from "../constants"
import type { AtomicValue } from "../types/value-atomic"
import type { ColorValue } from "../values/appearance/color"
import type { ComputedHighContrastValue } from "../values/shared/computed/high-contrast-color"
import type { EmptyValue } from "../values/shared/empty/empty"
import type { Hex, HexValue } from "../values/shared/exact/hex"
import type { HSL } from "../values/shared/exact/hsl"
import type { LCH } from "../values/shared/exact/lch"
import type { PercentageValue } from "../values/shared/exact/percentage"
import type { RGB } from "../values/shared/exact/rgb"
import { resolveBasedOnWithAnchor } from "./get-based-on-value"
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

const LAYERED_PAINT_ROOTS = ["background", "shadow"] as const

function normalizeLayerFacetPath(path: string): string {
  for (const root of LAYERED_PAINT_ROOTS) {
    const prefix = `${root}.`
    if (!path.startsWith(prefix)) continue

    const rest = path.slice(prefix.length)
    if (/^\d+\./.test(rest)) continue

    return `${root}.0.${rest}`
  }

  return path
}

function isNonContributingLayerPercentage(value: unknown): boolean {
  if (!value || typeof value !== "object" || !("type" in value)) {
    return true
  }

  const tagged = value as { type: ValueType }
  return tagged.type === ValueType.EMPTY || tagged.type === ValueType.INHERIT
}

/**
 * Reads the color at `basedOn`, optionally reads sibling `.brightness` and `.opacity` on the same
 * background layer where the color walk stopped, resolves through the theme, then returns the
 * theme's white or black swatch so text reads on that background. Sibling facets do not walk to
 * grandparents when empty on the anchored layer. `basedOn` is required on the stored value
 * (typically `#parent.background.color` for foreground-on-surface). When the path misses or
 * resolves to an empty or transparent color, the reference surface falls back to pure white.
 *
 * @param value - Stored computed high-contrast value
 * @param context - Theme and contexts for resolution
 * @returns `EXACT` string taken from `@swatch.white` or `@swatch.black` on the theme
 */
export function computeHighContrastColor(
  value: ComputedHighContrastValue,
  context: ComputeContext,
) {
  const { basedOnValue, brightness, opacity, backdrop } =
    resolveHighContrastInputs(value, context)

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

  let color: ColorValue | HexValue = surface

  if (brightness && surface.type === ValueType.EXACT) {
    color = {
      type: ValueType.EXACT as const,
      value: convertAndApplyBrightness(surface.value, brightness.value.value),
    }
  }

  if (opacity && color.type === ValueType.EXACT) {
    color = applyLayerOpacity(color.value, opacity.value.value, backdrop)
  }

  const isDark = isDarkBackgroundColor(color)

  const themeOption = getThemeOption(
    isDark ? "@swatch.white" : "@swatch.black",
    context.theme,
  ) as ThemeSwatch

  const output = themeSwatchToColorValue(themeOption)

  return output
}

function resolveHighContrastInputs(
  value: ComputedHighContrastValue,
  context: ComputeContext,
): {
  basedOnValue: AtomicValue
  brightness: PercentageValue | undefined
  opacity: PercentageValue | undefined
  backdrop: HSL | LCH | RGB | Hex | undefined
} {
  const basedOn = value.value.input?.basedOn ?? "#parent.background.color"

  try {
    const { value: resolvedValue, facetSource } = resolveBasedOnWithAnchor(
      basedOn,
      context,
    )

    // A `basedOn` color that is still `COMPUTED` (e.g. the surface uses `MATCH`)
    // has no resolvable color yet, so fall back to the reference surface instead
    // of handing a computed value to `resolveColor`, which cannot resolve it.
    if (
      !resolvedValue ||
      isCompoundValue(resolvedValue) ||
      (resolvedValue as { type?: ValueType }).type === ValueType.COMPUTED
    ) {
      return {
        basedOnValue: FALLBACK_SURFACE_COLOR,
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
  } catch {
    return {
      basedOnValue: FALLBACK_SURFACE_COLOR,
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
    : `#parent.${basedOn.replace(/^#(parent\.|self\.)?/, "")}`

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

function readAnchoredLayerPercentage(
  facetSource: Omit<ComputeContext, "theme">,
  colorBasedOn: string,
  facet: "brightness" | "opacity",
): PercentageValue | undefined {
  const layerPath = normalizeLayerFacetPath(
    colorBasedOn.replace(/^#(parent\.|self\.)?/, ""),
  )
  const facetPath = layerPath.replace(/\.color$/, `.${facet}`)
  const raw = findInObject(facetSource.properties, facetPath)

  if (isNonContributingLayerPercentage(raw)) {
    return undefined
  }

  return resolveValue(raw as PercentageValue | EmptyValue)
}

function applyLayerOpacity(
  color: HSL | LCH | RGB | Hex,
  opacityPercent: number,
  backdrop: HSL | LCH | RGB | Hex = FALLBACK_SURFACE_COLOR.value,
): HexValue {
  const colorString = exactColorToChromaInput(color)
  const backdropString = exactColorToChromaInput(backdrop)
  return {
    type: ValueType.EXACT,
    value: chroma
      .mix(backdropString, colorString, opacityPercent / 100, "rgb")
      .hex() as Hex,
  }
}

function exactColorToChromaInput(color: HSL | LCH | RGB | Hex): string {
  if (typeof color === "string") {
    if (isHex(color)) return color
    if (isHexWithoutHash(color)) return `#${color}`
    return color
  }

  if (isRGBObject(color)) {
    return RGBObjectToString(color)
  }

  if (isHSLObject(color)) {
    return HSLObjectToString(color)
  }

  if (isLCHObject(color)) {
    return LCHObjectToString(color)
  }

  throw new Error("Unable to parse color for opacity")
}
