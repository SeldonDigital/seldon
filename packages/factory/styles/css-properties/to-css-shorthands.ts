import { CSSObject } from "./types"

/**
 * Group matching values into a single shorthand
 *
 * @param baseStyles - The base styles object
 * @returns The styles object with shorthand values grouped
 */
export function toCSSShorthands(base: CSSObject): CSSObject {
  const styles = { ...base }

  if (
    areAllValuesEqual([
      styles.paddingTop,
      styles.paddingRight,
      styles.paddingBottom,
      styles.paddingLeft,
    ])
  ) {
    // Only create shorthand if padding doesn't already exist
    if (!styles.padding) {
      styles.padding = styles.paddingTop
    }
    delete styles.paddingTop
    delete styles.paddingRight
    delete styles.paddingBottom
    delete styles.paddingLeft
  }

  if (
    areAllValuesEqual([
      styles.marginTop,
      styles.marginRight,
      styles.marginBottom,
      styles.marginLeft,
    ])
  ) {
    // Only create shorthand if margin doesn't already exist
    if (!styles.margin) {
      styles.margin = styles.marginTop
    }
    delete styles.marginTop
    delete styles.marginRight
    delete styles.marginBottom
    delete styles.marginLeft
  }

  if (
    areAllValuesEqual([styles.top, styles.right, styles.bottom, styles.left])
  ) {
    // Only create shorthand if inset doesn't already exist
    if (!styles.inset) {
      styles.inset = styles.top
    }
    delete styles.top
    delete styles.right
    delete styles.bottom
    delete styles.left
  }

  if (
    areAllValuesEqual([
      styles.borderTopWidth,
      styles.borderRightWidth,
      styles.borderBottomWidth,
      styles.borderLeftWidth,
    ])
  ) {
    // Only create shorthand if borderWidth doesn't already exist
    if (!styles.borderWidth) {
      styles.borderWidth = styles.borderTopWidth
    }
    delete styles.borderTopWidth
    delete styles.borderRightWidth
    delete styles.borderBottomWidth
    delete styles.borderLeftWidth
  }

  if (
    areAllValuesEqual([
      styles.borderTopColor,
      styles.borderRightColor,
      styles.borderBottomColor,
      styles.borderLeftColor,
    ])
  ) {
    // Only create shorthand if borderColor doesn't already exist
    if (!styles.borderColor) {
      styles.borderColor = styles.borderTopColor
    }
    delete styles.borderTopColor
    delete styles.borderRightColor
    delete styles.borderBottomColor
    delete styles.borderLeftColor
  }

  if (
    areAllValuesEqual([
      styles.borderTopStyle,
      styles.borderRightStyle,
      styles.borderBottomStyle,
      styles.borderLeftStyle,
    ])
  ) {
    // Only create shorthand if borderStyle doesn't already exist
    if (!styles.borderStyle) {
      styles.borderStyle = styles.borderTopStyle
    }
    delete styles.borderTopStyle
    delete styles.borderRightStyle
    delete styles.borderBottomStyle
    delete styles.borderLeftStyle
  }

  if (
    areAllValuesEqual([
      styles.borderTopLeftRadius,
      styles.borderTopRightRadius,
      styles.borderBottomLeftRadius,
      styles.borderBottomRightRadius,
    ])
  ) {
    // Only create shorthand if borderRadius doesn't already exist
    if (!styles.borderRadius) {
      styles.borderRadius = styles.borderTopLeftRadius
    }
    delete styles.borderTopLeftRadius
    delete styles.borderTopRightRadius
    delete styles.borderBottomLeftRadius
    delete styles.borderBottomRightRadius
  }

  // Handle border shorthand
  if (styles.borderWidth && styles.borderStyle && styles.borderColor) {
    styles.border = `${styles.borderWidth} ${styles.borderStyle} ${styles.borderColor}`
    delete styles.borderWidth
    delete styles.borderStyle
    delete styles.borderColor
  }

  return styles
}

type CSSPropertyValue = string | number | undefined

function areAllValuesEqual(values: CSSPropertyValue[]) {
  return values.every((value) => value !== undefined && value === values[0])
}
