import { useMemo } from "react"

/**
 * Gets the styles for a given element that are applied via class names
 * @param element
 * @returns
 */
export function useClassStyles(element: HTMLElement | null) {
  return useMemo(() => {
    if (!element) return []

    const classList = Array.from(element.classList)
    const styleProperties: string[] = []

    // Iterate through all stylesheets in the document
    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        const rules = sheet.cssRules
        if (!rules) return

        // Check each rule to see if it matches any of our element's classes
        Array.from(rules).forEach((rule) => {
          // Only process CSSStyleRule (regular CSS rules, not @media, @keyframes, etc.)
          if (rule.type === CSSRule.STYLE_RULE) {
            const styleRule = rule as CSSStyleRule
            const selector = styleRule.selectorText

            // Check if this rule applies to any of our element's classes
            const hasMatchingClass = classList.some((className) => {
              // Match class selectors (.className) and compound selectors
              return (
                selector.includes(`.${className}`) ||
                selector.includes(` ${className}`) ||
                selector === className
              )
            })

            if (hasMatchingClass) {
              // Extract all properties from this rule
              Array.from(styleRule.style).forEach((property) => {
                const value = styleRule.style.getPropertyValue(property)
                if (value) {
                  styleProperties.push(`${property}: ${value};`)
                }
              })
            }
          }
        })
      } catch (error) {
        // Skip stylesheets that can't be accessed (e.g., cross-origin)
      }
    })

    // Sort properties alphabetically for better readability
    return styleProperties.sort()
  }, [element])
}
