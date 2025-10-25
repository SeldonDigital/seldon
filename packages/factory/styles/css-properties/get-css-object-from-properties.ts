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

  // Helper function to safely generate styles - returns empty object if error occurs
  const safeGetStyles = (styleFunction: () => CSSObject): CSSObject => {
    try {
      return styleFunction()
    } catch (error) {
      // Log the error for debugging but don't crash the CSS generation
      console.warn(`CSS generation error for ${styleFunction.name}:`, error)
      return {}
    }
  }

  let styles: CSSObject = {
    ...safeGetStyles(() =>
      getDisplayStyles({ properties: computedProperties }),
    ),
    // styles.backgroundImage is based on multiple properties, so we need to pass in the nodeProperties
    ...safeGetStyles(() =>
      getBackgroundStyles({
        properties: originalProperties,
        parentContext,
        theme,
      }),
    ),
    ...safeGetStyles(() => getCursorStyles({ properties: computedProperties })),
    ...safeGetStyles(() =>
      getBorderStyles({
        properties: computedProperties,
        parentContext,
        theme,
      }),
    ),
    ...safeGetStyles(() => getScrollStyles({ properties: computedProperties })),
    ...safeGetStyles(() => getClipStyles({ properties: computedProperties })),
    ...safeGetStyles(() =>
      getColorStyles({ properties: computedProperties, parentContext, theme }),
    ),
    ...safeGetStyles(() =>
      getCornersStyles({ properties: computedProperties, theme }),
    ),
    ...safeGetStyles(() => getImageStyles({ properties: computedProperties })),
    ...safeGetStyles(() =>
      getLayoutStyles({
        computedProperties: computedProperties,
        nodeProperties: originalProperties,
        theme,
      }),
    ),
    ...safeGetStyles(() =>
      getMarginStyles({ properties: computedProperties, theme }),
    ),
    ...safeGetStyles(() =>
      getOpacityStyles({ properties: computedProperties }),
    ),
    ...safeGetStyles(() =>
      getPaddingStyles({ properties: computedProperties, theme }),
    ),
    ...safeGetStyles(() =>
      getRotationStyles({ properties: computedProperties }),
    ),
    ...safeGetStyles(() => getRTLStyles({ properties: computedProperties })),
    ...safeGetStyles(() =>
      getShadowStyles({
        properties: computedProperties,
        parentContext,
        theme,
      }),
    ),
    ...safeGetStyles(() =>
      getSizeStyles({ properties: computedProperties, parentContext, theme }),
    ),
    ...safeGetStyles(() =>
      getTextStyles({ properties: computedProperties, parentContext, theme }),
    ),
    ...safeGetStyles(() =>
      getIconStyles({ properties: computedProperties, parentContext, theme }),
    ),
    ...safeGetStyles(() =>
      getTableStyles({ properties: computedProperties, theme }),
    ),
    ...safeGetStyles(() =>
      getPositionStyles({ properties: computedProperties, theme }),
    ),
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
