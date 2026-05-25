import { COLORS } from "@lib/ui/colors"
import { isCompoundProperty, isShorthandProperty } from "./property-types"

// Property status colors
export const COLOR_SET = COLORS.pearl[500]
export const COLOR_UNSET = COLORS.pearl[700]
export const COLOR_NOT_USED = COLORS.charcoal[400]
export const COLOR_ERROR = COLORS.negative[500]
export const COLOR_OVERRIDE = COLORS.primary[500]

// Debug mode colors
export const COLOR_DEBUG_COMPOUND = COLORS.accent[500]
export const COLOR_DEBUG_SHORTHAND = COLORS.warning[500]

/**
 * Checks if a property is a shorthand compound property
 * @param property - Property object with type and key
 * @returns True if property is shorthand type and has shorthand key
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
 * @param property - Property object with type and key
 * @returns True if property is compound type and has compound key
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
 * Gets the display color for a property based on its status and type
 * @param property - Property object with type, key, status, and sub-property flag
 * @param debugMode - Whether to use debug color scheme
 * @returns CSS color value (LCH format)
 */
export function getPropertyDisplayColor(
  property: {
    propertyType: string
    key: string
    status: string
    isSubProperty: boolean
  },
  debugMode: boolean = false,
): string {
  if (debugMode) {
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

    if (property.status === "unset") {
      return COLOR_UNSET
    }
    if (property.status === "error") {
      return COLOR_ERROR
    }
    if (property.status === "override") {
      return COLOR_OVERRIDE
    }

    return COLOR_SET
  }

  if (property.status === "not used") {
    return COLOR_NOT_USED
  }

  if (!property.isSubProperty) {
    if (isCompoundCompoundProperty(property)) {
      if (property.status === "set") {
        return COLOR_SET
      }
      if (property.status === "error") {
        return COLOR_ERROR
      }
      if (property.status === "override") {
        return COLOR_OVERRIDE
      }
      if (property.status === "not used") {
        return COLOR_NOT_USED
      }
      return COLOR_UNSET
    }

    if (isShorthandCompoundProperty(property)) {
      if (property.status === "set") {
        return COLOR_SET
      }
      if (property.status === "error") {
        return COLOR_ERROR
      }
      if (property.status === "override") {
        return COLOR_OVERRIDE
      }
      if (property.status === "not used") {
        return COLOR_NOT_USED
      }
      return COLOR_UNSET
    }
  }

  if (property.status === "unset") {
    return COLOR_UNSET
  }
  if (property.status === "error") {
    return COLOR_ERROR
  }
  if (property.status === "override") {
    return COLOR_OVERRIDE
  }

  return COLOR_SET
}
