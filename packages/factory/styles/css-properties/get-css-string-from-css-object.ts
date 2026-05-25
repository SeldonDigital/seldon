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

  // Process entries even if empty - we want empty classes to exist as rules
  for (const [key, value] of entries) {
    // Filter out undefined, null, and empty strings to avoid invalid CSS like "color:;"
    if (value !== undefined && value !== null && value !== "") {
      styles.push(`${kebabCase(key)}: ${value};`)
    }
  }

  // If the css object contains no valid values, return empty rule to ensure classname exists
  if (styles.length === 0) {
    return `.${className} {}`
  }

  return `.${className} {${styles.join("\n")}}`
}
