import { CSSProperties } from "react"
import { subPropertyRowBackground } from "../../helpers/sidebar-styles"
import { FlatProperty } from "./properties-data"
import { getPropertyDisplayColor } from "./property-styling"

/**
 * Gets the display color value for a property based on its status and type
 * Returns CSS color value (LCH format)
 */
export function getPropertyDisplayColorValue(
  property: {
    propertyType: string
    key: string
    status: string
    isSubProperty: boolean
  },
  debugMode: boolean = false,
): string {
  return getPropertyDisplayColor(property, debugMode)
}

/**
 * Gets the style object for a property row using Seldon theme tokens
 */
export function getPropertyRowStyle(
  property: FlatProperty,
  debugMode: boolean = false,
): CSSProperties {
  const color = getPropertyDisplayColorValue(property, debugMode)

  return {
    color,
    paddingRight: "var(--sdn-padding-tight)",
    paddingTop: "var(--sdn-padding-tight)",
    paddingBottom: "var(--sdn-padding-tight)",
    ...(property.isSubProperty
      ? {
          backgroundColor: subPropertyRowBackground,
        }
      : {}),
  }
}

/**
 * Gets the style object for a property label using Seldon theme tokens
 */
export function getPropertyLabelStyle(
  property: FlatProperty,
  debugMode: boolean = false,
): CSSProperties {
  const baseColor = getPropertyDisplayColorValue(property, debugMode)

  // Outside debug mode, property status maps to a generated leaf state
  // (activated, invalid, disabled) applied on the row's refs, so leave the leaf
  // color to those state styles instead of baking a status color inline. Debug
  // mode keeps the inline status colors for its type visualization.
  return {
    fontFamily: "var(--sdn-seldon-font-family-primary)",
    fontSize: "var(--sdn-seldon-font-size-xsmall)",
    fontWeight: "var(--sdn-seldon-font-weight-medium)",
    lineHeight: 1.15,
    letterSpacing: "0.1px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    ...(debugMode ? { color: baseColor } : {}),
    ...(property.isDimmed ? { opacity: 0.5 } : {}),
    ...(property.isSubProperty
      ? { paddingLeft: "var(--sdn-seldon-padding-compact)" }
      : {}),
  }
}
