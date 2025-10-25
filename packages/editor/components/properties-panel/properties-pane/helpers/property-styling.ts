import { isCompoundProperty, isShorthandProperty } from "./property-types"

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
 * @returns CSS color class string
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
      return "text-[rgb(72,72,72)]"
    }

    if (!property.isSubProperty) {
      if (isCompoundCompoundProperty(property)) {
        return "text-[rgb(215,29,215)]"
      }
      if (isShorthandCompoundProperty(property)) {
        return "text-orange-400"
      }
    }

    if (property.status === "unset") {
      return "text-[rgb(128,128,128)]"
    }
    if (property.status === "error") {
      // Red: HSL(0, 100%, 65%)
      return "text-[hsl(0,100%,65%)]"
    }
    if (property.status === "override") {
      // Blue: HSL(203, 100%, 62%)
      return "text-[hsl(203,100%,62%)]"
    }

    return "text-[rgb(255,255,255)]"
  }

  if (property.status === "not used") {
    return "text-[rgb(72,72,72)]"
  }

  if (!property.isSubProperty) {
    if (isCompoundCompoundProperty(property)) {
      if (property.status === "set") {
        return "text-[rgb(255,255,255)]"
      }
      if (property.status === "error") {
        return "text-[hsl(0,100%,65%)]"
      }
      if (property.status === "override") {
        return "text-[hsl(203,100%,62%)]"
      }
      if (property.status === "not used") {
        return "text-[rgb(72,72,72)]"
      }
      return "text-[rgb(128,128,128)]"
    }

    if (isShorthandCompoundProperty(property)) {
      if (property.status === "set") {
        return "text-[rgb(255,255,255)]"
      }
      if (property.status === "error") {
        return "text-[hsl(0,100%,65%)]"
      }
      if (property.status === "override") {
        return "text-[hsl(203,100%,62%)]"
      }
      if (property.status === "not used") {
        return "text-[rgb(72,72,72)]"
      }
      return "text-[rgb(128,128,128)]"
    }
  }

  if (property.status === "unset") {
    return "text-[rgb(128,128,128)]"
  }
  if (property.status === "error") {
    // Red: HSL(0, 100%, 65%)
    return "text-[hsl(0,100%,65%)]"
  }
  if (property.status === "override") {
    // Blue: HSL(203, 100%, 62%)
    return "text-[hsl(203,100%,62%)]"
  }

  return "text-[rgb(255,255,255)]"
}
