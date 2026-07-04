import { isCompoundProperty, isShorthandProperty } from "./property-types"

// Debug palette for the "Show Property Types" visualization. Outside debug
// mode, property status maps to generated leaf states (activated, invalid,
// disabled) on the row's refs, so no inline status colors apply.
const COLOR_SET = "var(--sdn-swatch-white)"
const COLOR_NOT_USED =
  "color-mix(in srgb, var(--sdn-swatch-white) 45%, var(--sdn-swatch-offBlack))"
const COLOR_ERROR = "var(--sdn-swatch-negative)"
const COLOR_OVERRIDE = "var(--sdn-swatch-primary)"
const COLOR_DEBUG_COMPOUND = "var(--sdn-swatch-accent)"
const COLOR_DEBUG_SHORTHAND = "var(--sdn-swatch-warning)"
const COLOR_DEBUG_DEFAULT = "var(--sdn-swatch-positive)"

/**
 * Checks if a property is a shorthand compound property
 */
export function isShorthandCompoundProperty(property: {
  propertyType: string
  key: string
}): boolean {
  return (
    property.propertyType === "shorthand" && isShorthandProperty(property.key)
  )
}

/**
 * Checks if a property is a compound compound property
 */
export function isCompoundCompoundProperty(property: {
  propertyType: string
  key: string
}): boolean {
  return (
    property.propertyType === "compound" && isCompoundProperty(property.key)
  )
}

/**
 * Gets the debug-mode display color for a property based on its status and
 * type. Only applies when the "Show Property Types" debug toggle is on.
 */
export function getPropertyDebugColor(property: {
  propertyType: string
  key: string
  status: string
  isSubProperty: boolean
}): string {
  if (property.status === "not used") {
    return COLOR_NOT_USED
  }

  if (!property.isSubProperty) {
    if (isCompoundCompoundProperty(property)) {
      return COLOR_DEBUG_COMPOUND
    }
    if (isShorthandCompoundProperty(property)) {
      return COLOR_DEBUG_SHORTHAND
    }
  }

  // Empty values keep the pearl color; default (set) values are tinted green.
  if (property.status === "unset") {
    return COLOR_SET
  }
  if (property.status === "error") {
    return COLOR_ERROR
  }
  if (property.status === "override") {
    return COLOR_OVERRIDE
  }

  return COLOR_DEBUG_DEFAULT
}
