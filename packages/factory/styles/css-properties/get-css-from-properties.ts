import { Properties } from "@seldon/core"
import { computeProperties } from "@seldon/core/compute/compute-properties"
import { StyleGenerationContext } from "../types"
import { getCssObjectFromProperties } from "./get-css-object-from-properties"
import { getCssStringFromCssObject } from "./get-css-string-from-css-object"
import { getShorthandValues } from "./get-shorthand-values"
import { CSSObject } from "./types"

/**
 * Turn a properties object into CSS styles
 *
 * @param selectedProperties - The subset of the properties to convert to styles
 * @param context - The complete context of the node, including its properties, parent properties, and theme
 * @returns The CSS styles
 */

export function getCssFromProperties(
  propertiesSubset: Properties,
  context: StyleGenerationContext,
  className: string,
): string {
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

  let styles = getCssObjectFromProperties(computedProperties, context)

  styles = removeUndefinedValues(styles)
  styles = getShorthandValues(styles)

  return getCssStringFromCssObject(styles, className)
}

/**
 * Remove undefined values from the styles object
 *
 * @param styles - The styles object
 * @returns The styles object with undefined values removed
 */
function removeUndefinedValues(styles: CSSObject) {
  return Object.fromEntries(
    Object.entries(styles).filter(([_, value]) => value !== undefined),
  )
}
