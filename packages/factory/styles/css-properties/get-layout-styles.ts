import {
  Direction,
  Gap,
  Orientation,
  Properties,
  ValueType,
} from "@seldon/core"
import { modulate } from "@seldon/core/helpers/math/modulate"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { Theme, ThemeModulation } from "@seldon/core/themes/types"
import { getCssValue } from "./get-css-value"
import { CSSObject } from "./types"

export function getLayoutStyles({
  computedProperties,
  nodeProperties,
  theme,
}: {
  computedProperties: Properties
  nodeProperties: Properties
  theme: Theme
}): CSSObject {
  const styles: CSSObject = {}

  const direction = resolveValue(nodeProperties.direction)
  const wrapChildren = resolveValue(nodeProperties.wrapChildren)
  const orientation = resolveValue(nodeProperties.orientation)
  const align = resolveValue(nodeProperties.align)

  // "computedProperties" contains computed properties, "nodeProperties" might contain properties that have not been computed yet
  // gap value might be computed, so we need to use the computed "computedProperties" object otherwise generating gap will fail
  const gap = resolveValue(computedProperties.gap)

  const isRtl =
    direction?.type === ValueType.PRESET && direction.value === Direction.RTL

  if (wrapChildren) {
    styles.flexWrap = wrapChildren?.value ? "wrap" : "nowrap"
  }

  if (orientation) {
    styles.display = "flex"
    styles.flexDirection =
      orientation?.value === Orientation.HORIZONTAL ? "row" : "column"
  }
  if (align) {
    const horizontalLTRLayout = {
      auto: { align: "normal", justify: "normal" },
      "top-left": { align: "start", justify: "start" },
      left: { align: "center", justify: "start" },
      "bottom-left": { align: "end", justify: "start" },
      "top-center": { align: "start", justify: "center" },
      center: { align: "center", justify: "center" },
      "bottom-center": { align: "end", justify: "center" },
      "top-right": { align: "start", justify: "end" },
      right: { align: "center", justify: "end" },
      "bottom-right": { align: "end", justify: "end" },
    } as const

    const horizontalRTLLayout = {
      auto: { align: "normal", justify: "normal" },
      "top-right": { align: "start", justify: "start" },
      left: { align: "center", justify: "end" },
      "bottom-right": { align: "end", justify: "start" },
      "top-center": { align: "start", justify: "center" },
      center: { align: "center", justify: "center" },
      "bottom-center": { align: "end", justify: "center" },
      "top-left": { align: "start", justify: "end" },
      right: { align: "center", justify: "start" },
      "bottom-left": { align: "end", justify: "end" },
    } as const

    const verticalLTRLayout = {
      auto: { align: "normal", justify: "normal" },
      "top-left": { align: "start", justify: "start" },
      left: { align: "start", justify: "center" },
      "bottom-left": { align: "start", justify: "end" },
      "top-center": { align: "center", justify: "start" },
      center: { align: "center", justify: "center" },
      "bottom-center": { align: "center", justify: "end" },
      "top-right": { align: "end", justify: "start" },
      right: { align: "end", justify: "center" },
      "bottom-right": { align: "end", justify: "end" },
    } as const

    const verticalRTLLayout = {
      auto: { align: "normal", justify: "normal" },
      "top-right": { align: "start", justify: "start" },
      left: { align: "end", justify: "center" },
      "bottom-right": { align: "start", justify: "end" },
      "top-center": { align: "center", justify: "start" },
      center: { align: "center", justify: "center" },
      "bottom-center": { align: "center", justify: "end" },
      "top-left": { align: "end", justify: "start" },
      right: { align: "start", justify: "center" },
      "bottom-left": { align: "end", justify: "end" },
    } as const

    const orientationValue = orientation
      ? orientation.value
      : Orientation.VERTICAL

    const map =
      orientationValue === Orientation.HORIZONTAL
        ? isRtl
          ? horizontalRTLLayout
          : horizontalLTRLayout
        : isRtl
          ? verticalRTLLayout
          : verticalLTRLayout

    styles.display = "flex"
    styles.alignItems = map[align.value]?.align
    styles.justifyContent = map[align.value]?.justify
  }

  if (gap) {
    switch (gap.type) {
      case ValueType.EXACT:
        styles.gap = getCssValue(gap) as string // We're sure that the value is a string since its an PixelValue or RemValue
        break

      case ValueType.PRESET:
        if (gap.value === Gap.EVENLY_SPACED) {
          styles.gap = "auto"
          styles.justifyContent = "space-between"
        } else {
          // @ts-expect-error - unknown preset
          throw new Error(`Unknown gap preset: ${gap.value}`)
        }
        break

      case ValueType.THEME_ORDINAL:
        const themeValue = getThemeOption(gap.value, theme) as ThemeModulation
        styles.gap =
          modulate({
            step: themeValue.parameters.step,
            size: theme.core.size,
            ratio: theme.core.ratio,
          }) + "rem"
        break

      default:
        throw new Error(`Unknown gap type: ${gap.type}`)
    }
  }

  return styles
}
