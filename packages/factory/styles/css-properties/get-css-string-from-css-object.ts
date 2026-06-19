import { kebabCase } from "../../export/react/utils/case-utils"
import { CSSObject } from "./types"

/**
 * Convert a CSSObject to a string that can be inserted into a stylesheet
 * @param cssObject
 * @param className
 * @param selector Optional full selector to use instead of `.${className}`.
 *   Used to emit interaction-state rules such as `.my-class:hover` or grouped
 *   selectors like `.my-class:disabled, .my-class[aria-disabled="true"]`.
 * @returns
 *
 * Example (for component styles):
 * getCssStringFromCssProperties({ color: "red" }, "my-class")
 * output: ".my-class { color: red; }"
 */
export function getCssStringFromCssObject(
  cssObject: CSSObject,
  className: string,
  selector?: string,
) {
  const ruleSelector = selector ?? `.${className}`
  const styles: string[] = []

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
    return `${ruleSelector} {}`
  }

  return `${ruleSelector} {${styles.join("\n")}}`
}
