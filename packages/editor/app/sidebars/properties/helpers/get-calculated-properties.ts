/**
 * Helper function to get calculated CSS properties from the DOM element (like ComputedPane)
 *
 * Gets the calculated CSS styles applied to the element via class names
 * and converts them to FlatProperty objects for display in the property tree.
 * These are display-only values, distinct from computed property types.
 */
import { useMemo } from "react"
import { Board, Instance, ValueType, Variant, Workspace } from "@seldon/core"
import { getHtmlElementByNodeId } from "@app/canvas/helpers/get-html-element-by-node-id"
import { FlatProperty } from "./properties-data"

/**
 * Gets CSS styles from the DOM element (same logic as ComputedPane)
 */
function getClassStyles(element: HTMLElement | null): string[] {
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
}

/**
 * Formats a CSS property name for display (e.g., "background-color" -> "Background Color")
 */
function formatCssPropertyLabel(property: string): string {
  return property
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Converts CSS property strings to FlatProperty objects
 * Calculated properties are read-only display values, so we create them directly
 */
function cssPropertiesToFlatProperties(
  cssProperties: string[],
  _node: Variant | Instance | Board,
  _workspace: Workspace,
): FlatProperty[] {
  if (cssProperties.length === 0) {
    return []
  }

  return cssProperties
    .map((cssProperty) => {
      // Parse CSS property string (e.g., "color: #000000;" or "background-image: url("https://example.com/image.jpg");")
      // Split only on the FIRST colon to handle URLs and other values that contain colons
      const colonIndex = cssProperty.indexOf(":")
      if (colonIndex === -1) {
        // Skip malformed CSS properties
        return null
      }
      const property = cssProperty.substring(0, colonIndex).trim()
      const value = cssProperty.substring(colonIndex + 1).trim()
      const cleanValue = value.replace(/;$/, "") // Remove trailing semicolon

      // Create a FlatProperty directly (calculated properties aren't in the registry)
      return {
        key: `calculated.${property}`,
        label: formatCssPropertyLabel(property),
        value: {
          type: ValueType.EXACT,
          value: cleanValue,
        },
        actualValue: cleanValue,
        valueType: ValueType.EXACT,
        propertyType: "atomic" as const,
        isCompound: false,
        isShorthand: false,
        isSubProperty: false,
        status: "set" as const,
        icon: "seldon-token",
        controlType: undefined,
      } as FlatProperty
    })
    .filter((prop): prop is FlatProperty => prop !== null)
}

/**
 * Gets calculated CSS properties from the DOM element for display
 * These are display-only values showing the actual computed CSS styles.
 */
export function useCalculatedProperties(
  node: Variant | Instance | Board | null,
  workspace: Workspace,
): FlatProperty[] {
  return useMemo(() => {
    if (!node || isBoard(node)) {
      return []
    }

    const element = getHtmlElementByNodeId(node.id)
    const cssProperties = getClassStyles(element)

    return cssPropertiesToFlatProperties(cssProperties, node, workspace)
  }, [node, workspace])
}

/**
 * Gets CSS properties as raw CSS strings for syntax highlighting.
 * Returns an array of CSS property strings (e.g., ["color: #000000;", "padding: 12px;"]).
 */
export function useCssStrings(
  node: Variant | Instance | Board | null,
): string[] {
  return useMemo(() => {
    if (!node || isBoard(node)) {
      return []
    }

    const element = getHtmlElementByNodeId(node.id)
    return getClassStyles(element)
  }, [node])
}

function isBoard(node: Variant | Instance | Board): node is Board {
  return "id" in node && !("component" in node)
}
