import { ValueType } from "@seldon/core"

/**
 * Extracts the actual property name from a property key (handles sub-properties)
 * @param propertyKey - The property key to extract name from
 * @returns The actual property name
 */
export function getActualPropertyName(propertyKey: string): string {
  if (propertyKey.includes(".")) {
    const parts = propertyKey.split(".")
    return parts[parts.length - 1]
  }
  return propertyKey.split(".")[0]
}

/**
 * Gets placeholder text for a property control
 * @param property - Property object with value
 * @param defaultPlaceholder - Default placeholder text
 * @returns Placeholder text based on property value
 */
export function getPropertyPlaceholder(
  property: { value: unknown },
  defaultPlaceholder: string,
): string {
  return isValueEmpty(property.value) ? "Default" : defaultPlaceholder
}

/**
 * Formats a property key into a readable label
 * @param propertyKey - The property key to format
 * @returns Formatted property label
 */
export function formatPropertyLabel(propertyKey: string): string {
  return propertyKey
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

/**
 * Creates a special UI presentation label for sub-properties by removing parent text
 * This is editor-only logic to make sub-property labels more concise
 * @param parentPropertyKey - The parent property key (e.g., "margin", "border")
 * @param subPropertyKey - The sub-property key (e.g., "top", "style")
 * @param registryLabel - The full label from registry (e.g., "Margin Top", "Border Style")
 * @returns Simplified label with parent text removed (e.g., "Top", "Style")
 */
export function createSubPropertyLabel(
  parentPropertyKey: string,
  subPropertyKey: string,
  registryLabel?: string,
): string {
  // If we have a registry label, use it as the base
  if (registryLabel) {
    // Remove the parent property name from the label (can be anywhere in the label)
    const parentLabel = formatPropertyLabel(parentPropertyKey)

    // Handle special cases for plural forms
    let parentTextToRemove = parentLabel
    if (parentLabel.endsWith("s") && !parentLabel.endsWith("ss")) {
      // Remove 's' from the end for singular form (e.g., "Corners" -> "Corner")
      parentTextToRemove = parentLabel.slice(0, -1)
    }

    // Remove parent text from anywhere in the label
    let simplifiedLabel = registryLabel
    const parentTextRegex = new RegExp(`\\b${parentTextToRemove}\\b`, "gi")
    simplifiedLabel = simplifiedLabel.replace(parentTextRegex, "").trim()

    // Clean up any double spaces that might have been created
    simplifiedLabel = simplifiedLabel.replace(/\s+/g, " ")

    // If the simplified label is empty or just whitespace, fall back to sub-property key
    if (!simplifiedLabel) {
      return formatPropertyLabel(subPropertyKey)
    }

    return simplifiedLabel
  }

  // Fallback: just format the sub-property key
  return formatPropertyLabel(subPropertyKey)
}

/**
 * Gets the value type from a property value
 * @param value - The property value to check
 * @returns The value type or EMPTY if not found
 */
export function getValueType(value: unknown): ValueType {
  return value && typeof value === "object" && "type" in value
    ? (value.type as ValueType)
    : ValueType.EMPTY
}

/**
 * Checks if a value is empty or unset
 * @param value - The value to check
 * @returns True if the value is empty, null, undefined, or has EMPTY type
 */
export function isValueEmpty(value: unknown): boolean {
  if (!value || value === null || value === undefined) {
    return true
  }
  if (typeof value === "object" && "type" in value) {
    return (value as { type: ValueType }).type === ValueType.EMPTY
  }
  return false
}
