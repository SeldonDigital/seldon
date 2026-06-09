import {
  COLOR_DEBUG_COMPOUND,
  COLOR_DEBUG_SHORTHAND,
  COLOR_ERROR,
  COLOR_NOT_USED,
  COLOR_OVERRIDE,
  COLOR_SET,
  COLOR_UNSET,
} from "../../helpers/sidebar-styles"
import { isCompoundProperty, isShorthandProperty } from "./property-types"

export {
  COLOR_SET,
  COLOR_UNSET,
  COLOR_NOT_USED,
  COLOR_ERROR,
  COLOR_OVERRIDE,
  COLOR_DEBUG_COMPOUND,
  COLOR_DEBUG_SHORTHAND,
}

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
 * Gets the display color for a property based on its status and type
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
