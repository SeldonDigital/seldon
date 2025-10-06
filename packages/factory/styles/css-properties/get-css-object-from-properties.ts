import { Properties } from "@seldon/core"
import { computeProperties } from "@seldon/core/compute/compute-properties"
import { StyleGenerationContext } from "../types"
import { getBackgroundStyles } from "./get-background-styles"
import { getBorderStyles } from "./get-border-styles"
import { getClipStyles } from "./get-clip-styles"
import { getColorStyles } from "./get-color-styles"
import { getCornersStyles } from "./get-corners-styles"
import { getCursorStyles } from "./get-cursor-styles"
import { getDisplayStyles } from "./get-display-styles"
import { getIconStyles } from "./get-icon-styles"
import { getImageStyles } from "./get-image-styles"
import { getLayoutStyles } from "./get-layout-styles"
import { getMarginStyles } from "./get-margin-styles"
import { getOpacityStyles } from "./get-opacity-styles"
import { getPaddingStyles } from "./get-padding-styles"
import { getPositionStyles } from "./get-position-styles"
import { getRotationStyles } from "./get-rotation-styles"
import { getRTLStyles } from "./get-rtl-styles"
import { getScrollStyles } from "./get-scroll-styles"
import { getShadowStyles } from "./get-shadow-styles"
import { getSizeStyles } from "./get-size-styles"
import { getTableStyles } from "./get-table-styles"
import { getTextStyles } from "./get-text-styles"
import { toCSSShorthands } from "./to-css-shorthands"
import { CSSObject } from "./types"

export function getCssObjectFromProperties(
  propertiesSubset: Properties,
  context: StyleGenerationContext,
): CSSObject {
  /**
   * We need to to compute the raw properties first, so that we can use the resolved values in the styles functions. E.g.
   *
   * @example
   * {
   *   color: {
   *     type: ValueType.Computed,
   *     function: ComputedFunction.HIGH_CONTRAST_COLOR
   *   }
   * }
   *
   * Computes/resolves to:
   *
   * {
   *   color: {
   *     type: ValueType.EXACT,
   *     value: "#eee"
   *   }
   * }
   *
   */
  const computedProperties = computeProperties(propertiesSubset, context)

  const { properties: originalProperties, parentContext, theme } = context
  let styles: CSSObject = {
    ...getDisplayStyles({ properties: computedProperties }),
    // styles.backgroundImage is based on multiple properties, so we need to pass in the nodeProperties
    ...getBackgroundStyles({
      properties: originalProperties,
      parentContext,
      theme,
    }),
    ...getCursorStyles({ properties: computedProperties }),
    ...getBorderStyles({
      properties: computedProperties,
      parentContext,
      theme,
    }),
    ...getClipStyles({ properties: computedProperties }),
    ...getColorStyles({ properties: computedProperties, parentContext, theme }),
    ...getCornersStyles({ properties: computedProperties, theme }),
    ...getImageStyles({ properties: computedProperties }),
    ...getLayoutStyles({
      computedProperties: computedProperties,
      nodeProperties: originalProperties,
      theme,
    }),
    ...getMarginStyles({ properties: computedProperties, theme }),
    ...getOpacityStyles({ properties: computedProperties }),
    ...getPaddingStyles({ properties: computedProperties, theme }),
    ...getRotationStyles({ properties: computedProperties }),
    ...getRTLStyles({ properties: computedProperties }),
    ...getShadowStyles({
      properties: computedProperties,
      parentContext,
      theme,
    }),
    ...getSizeStyles({ properties: computedProperties, parentContext, theme }),
    ...getTextStyles({ properties: computedProperties, parentContext, theme }),
    ...getScrollStyles({ properties: computedProperties }),
    ...getIconStyles({ properties: computedProperties, parentContext, theme }),
    ...getTableStyles({ properties: computedProperties, theme }),
    ...getPositionStyles({ properties: computedProperties, theme }),
  }

  styles = removeUndefinedStyles(styles)
  styles = toCSSShorthands(styles)

  return styles
}

/**
 * Filter out undefined values from the styles object
 *
 * @param styles - The styles object
 * @returns The styles object with undefined values filtered out
 */
function removeUndefinedStyles(styles: CSSObject) {
  return Object.fromEntries(
    Object.entries(styles).filter(([_, value]) => value !== undefined),
  )
}
