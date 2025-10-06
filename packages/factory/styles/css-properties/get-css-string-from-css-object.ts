import { kebabCase } from "../../export/react/utils/case-utils"
import { CSSObject } from "./types"

/**
 * Convert a CSSObject to a string that can be inserted into a stylesheet
 * @param cssObject
 * @param className
 * @returns
 *
 * Example (for component styles):
 * getCssStringFromCssProperties({ color: "red" }, "my-class")
 * output: ".my-class { color: red; }"
 */
export function getCssStringFromCssObject(
  cssObject: CSSObject,
  className: string,
) {
  /**
   * We need to iterate over the cssObject and convert it to a string
   * Later on we can handle other cases like hover, focus, etc.
   */
  let styles: string[] = []

  const entries = Object.entries(cssObject)

  // If the css object contains no values, return an empty string
  if (entries.length === 0) {
    return ""
  }

  for (const [key, value] of entries) {
    if (value !== undefined && value !== null) {
      styles.push(`${kebabCase(key)}: ${value};`)
    }
  }

  return `.${className} {${styles.join("\n")}}`
}
