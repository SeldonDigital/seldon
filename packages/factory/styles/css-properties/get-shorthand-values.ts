import { CSSObject } from "./types"

/**
 * Group shorthand values into a single property
 *
 * @param baseStyles - The base styles object
 * @returns The styles object with shorthand values grouped
 */
export function getShorthandValues(base: CSSObject): CSSObject {
  const styles = { ...base }

  if (
    areAllValuesEqual([
      styles.paddingTop,
      styles.paddingRight,
      styles.paddingBottom,
      styles.paddingLeft,
    ])
  ) {
    styles.padding = styles.paddingTop
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
    styles.margin = styles.marginTop
    delete styles.marginTop
    delete styles.marginRight
    delete styles.marginBottom
    delete styles.marginLeft
  }

  if (
    areAllValuesEqual([
      styles.borderTopColor,
      styles.borderRightColor,
      styles.borderBottomColor,
      styles.borderLeftColor,
    ])
  ) {
    styles.borderColor = styles.borderTopColor
    delete styles.borderTopColor
    delete styles.borderRightColor
    delete styles.borderBottomColor
    delete styles.borderLeftColor
  }

  if (
    areAllValuesEqual([
      styles.borderTopWidth,
      styles.borderRightWidth,
      styles.borderBottomWidth,
      styles.borderLeftWidth,
    ])
  ) {
    styles.borderWidth = styles.borderTopWidth
    delete styles.borderTopWidth
    delete styles.borderRightWidth
    delete styles.borderBottomWidth
    delete styles.borderLeftWidth
  }

  if (
    areAllValuesEqual([
      styles.borderTopStyle,
      styles.borderRightStyle,
      styles.borderBottomStyle,
      styles.borderLeftStyle,
    ])
  ) {
    styles.borderStyle = styles.borderTopStyle
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
    styles.borderRadius = styles.borderTopLeftRadius
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
  // Don't create shorthand if all values are undefined
  if (values.every((value) => value === undefined)) {
    return false
  }
  return values.every((value) => value === values[0])
}
