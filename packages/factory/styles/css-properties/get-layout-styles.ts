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
import type { LayoutMode } from "@seldon/core/properties/compute"
import { Theme, ThemeModulation } from "@seldon/core/themes/types"

import { getCssValue } from "./get-css-value"
import { getThemeTokenVarReference } from "./get-theme-token-reference"
import { CSSObject } from "./types"

/** Reads a positive integer track count from a resolved number value. */
function readTrackCount(value: unknown): number | null {
  if (
    !value ||
    typeof value !== "object" ||
    (value as { type?: unknown }).type !== ValueType.EXACT
  ) {
    return null
  }
  const stored = (value as { value: unknown }).value
  const raw =
    typeof stored === "number"
      ? stored
      : stored &&
          typeof stored === "object" &&
          "value" in stored &&
          typeof (stored as { value: unknown }).value === "number"
        ? (stored as { value: number }).value
        : null
  return raw !== null && raw >= 1 ? Math.floor(raw) : null
}

export function getLayoutStyles({
  computedProperties,
  nodeProperties,
  theme,
  layoutMode,
  useThemeVariableReferences,
}: {
  computedProperties: Properties
  nodeProperties: Properties
  theme: Theme
  layoutMode?: LayoutMode
  useThemeVariableReferences?: boolean
}): CSSObject {
  const styles: CSSObject = {}

  const direction = resolveValue(nodeProperties.direction)
  const wrapChildren = resolveValue(nodeProperties.wrapChildren)
  const orientation = resolveValue(nodeProperties.orientation)
  const align = resolveValue(nodeProperties.align)
  const wrapText = resolveValue(computedProperties.wrapText)

  // Wrap text off relies on text-overflow: ellipsis, which only applies to
  // block containers. Flex layout would disable the ellipsis, so it is
  // skipped for nodes that truncate their own text.
  const truncatesText = wrapText?.value === false

  // "computedProperties" contains computed properties, "nodeProperties" might contain properties that have not been computed yet
  // gap value might be computed, so we need to use the computed "computedProperties" object otherwise generating gap will fail
  const gap = resolveValue(computedProperties.gap)

  const isRtl =
    direction?.type === ValueType.OPTION && direction.value === Direction.RTL

  const isGrid = layoutMode === "grid"

  // Nine-position alignment maps. Grid reuses the horizontal map: alignItems
  // controls the block axis, justifyItems the inline axis.
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

  if (isGrid) {
    styles.display = "grid"

    const columns = readTrackCount(resolveValue(computedProperties.columns))
    const rows = readTrackCount(resolveValue(computedProperties.rows))

    if (columns) {
      styles.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`
    }
    if (rows) {
      styles.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`
    }

    if (align && !truncatesText) {
      const map = isRtl ? horizontalRTLLayout : horizontalLTRLayout
      styles.alignItems = map[align.value as keyof typeof map]?.align
      styles.justifyItems = map[align.value as keyof typeof map]?.justify
    }
  } else {
    if (wrapChildren) {
      styles.flexWrap = wrapChildren?.value ? "wrap" : "nowrap"
    }

    if (orientation && !truncatesText) {
      styles.display = "flex"
      styles.flexDirection =
        orientation?.value === Orientation.HORIZONTAL ? "row" : "column"
    }
    if (align && !truncatesText) {
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
      styles.alignItems = map[align.value as keyof typeof map]?.align
      styles.justifyContent = map[align.value as keyof typeof map]?.justify
    }
  }

  if (gap) {
    switch (gap.type) {
      case ValueType.EXACT:
        styles.gap = getCssValue(gap) as string // We're sure that the value is a string since its an PixelValue or RemValue
        break

      case ValueType.OPTION:
        if (gap.value === Gap.EVENLY_SPACED) {
          styles.gap = "auto"
          styles.justifyContent = "space-between"
        } else if (gap.value === Gap.NONE) {
          styles.gap = "0"
        } else {
          throw new Error(`Unknown gap preset: ${gap.value}`)
        }
        break

      case ValueType.THEME_ORDINAL: {
        const reference = useThemeVariableReferences
          ? getThemeTokenVarReference(gap.value)
          : undefined
        if (reference) {
          styles.gap = reference
        } else {
          const themeValue = getThemeOption(gap.value, theme) as ThemeModulation
          styles.gap =
            modulate({
              step: themeValue.parameters.step,
              size: theme.modulation.parameters.baseSize,
              ratio: theme.modulation.parameters.ratio,
            }) + "rem"
        }
        break
      }

      default:
        throw new Error(
          `Unknown gap type: ${(gap as { type: ValueType }).type}`,
        )
    }
  }

  return styles
}
