import { CSSProperties } from "react"
import { Theme } from "@seldon/core"
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
  theme: Theme,
  property: FlatProperty,
  debugMode: boolean = false,
): CSSProperties {
  const color = getPropertyDisplayColorValue(property, debugMode)

  return {
    color,
    paddingRight: theme.padding.tight.value,
    paddingTop: theme.padding.tight.value,
    paddingBottom: theme.padding.tight.value,
    ...(property.isSubProperty
      ? {
          backgroundColor: "hsl(0 0% 15% / 0.3)", // Equivalent to bg-neutral-900/30
        }
      : {}),
  }
}

/**
 * Gets the style object for a property label using Seldon theme tokens
 */
export function getPropertyLabelStyle(
  theme: Theme,
  property: FlatProperty,
  debugMode: boolean = false,
): CSSProperties {
  const baseColor = getPropertyDisplayColorValue(property, debugMode)

  return {
    fontFamily: "var(--sdn-seldon-font-family-primary)",
    fontSize: "var(--sdn-seldon-font-size-xsmall)",
    fontWeight: "var(--sdn-seldon-font-weight-medium)",
    lineHeight: 1.15,
    letterSpacing: "0.1px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: baseColor,
    ...(property.isDimmed ? { opacity: 0.5 } : {}),
    ...(property.isSubProperty
      ? { paddingLeft: "var(--sdn-seldon-padding-compact)" }
      : {}),
  }
}

/**
 * Gets the style object for debug info display
 */
export function getPropertyDebugInfoStyle(theme: Theme): CSSProperties {
  return {
    fontFamily: theme.fontFamily.primary,
    fontSize: theme.fontSize.xsmall.value,
    marginBottom: theme.margin.tight.value,
  }
}
