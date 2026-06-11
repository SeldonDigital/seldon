/**
 * Handles computed value changes for property controls
 */
import { ComputedFunction, Value, Workspace } from "@seldon/core"
import { Board, Instance, Variant } from "@seldon/core"
import { getPropertyCategory } from "@seldon/core/properties/schemas"
import { canApplyComputedSafely, createComputedValue } from "./computed-utils"
import { FlatProperty } from "./properties-data"
import { getSubPropertyKeys } from "./property-types"

interface HandleComputedValueOptions {
  property: FlatProperty
  newValue: string
  workspace: Workspace
  selection: Instance | Variant | Board | null
  setProperties: (
    properties: Record<string, unknown>,
    options?: { mergeSubProperties?: boolean },
  ) => void
  cleanCompoundValue: (compoundValue: unknown) => Record<string, unknown>
}

/**
 * Handles computed value changes
 * Returns true if the value was handled, false otherwise
 */
export function handleComputedValueChange({
  property,
  newValue,
  workspace,
  selection,
  setProperties,
  cleanCompoundValue,
}: HandleComputedValueOptions): boolean {
  try {
    const computedFunction = newValue as ComputedFunction

    if (
      selection &&
      !canApplyComputedSafely(computedFunction, workspace, selection)
    ) {
      console.error(
        `[PropertiesPane] Cannot apply computed function ${newValue} to ${property.key}: required inputs missing.`,
      )
      return false
    }

    // Apply computed value based on property type
    if (property.isSubProperty) {
      const [compoundKey, subKey] = property.key.split(".")
      const compoundValue =
        property.value && typeof property.value === "object"
          ? (property.value as Record<string, unknown>)
          : undefined
      const computedValue = createComputedValue(computedFunction, {
        currentValue: compoundValue?.[subKey],
        workspace,
        node: selection,
      })
      setProperties({
        [compoundKey]: {
          ...cleanCompoundValue(property.value),
          [subKey]: computedValue,
        },
      })
    } else {
      const computedValue = createComputedValue(computedFunction, {
        currentValue: property.value,
        workspace,
        node: selection,
      })
      applyComputedValueToProperty(property.key, computedValue, setProperties)
    }

    return true
  } catch (error) {
    console.error("Failed to create computed value:", error)
    return false
  }
}

/**
 * Applies computed value to a property based on its category
 */
function applyComputedValueToProperty(
  propertyKey: string,
  computedValue: Value,
  setProperties: (
    properties: Record<string, unknown>,
    options?: { mergeSubProperties?: boolean },
  ) => void,
): void {
  const propertyType = getPropertyCategory(propertyKey) || "atomic"

  if (propertyType === "atomic" || propertyType === "compound") {
    setProperties({
      [propertyKey]: computedValue,
    })
  } else if (propertyType === "shorthand") {
    const subPropertyKeys = getSubPropertyKeys(propertyKey)
    const compound: Record<string, unknown> = {}
    subPropertyKeys.forEach((subKey) => {
      compound[subKey] = computedValue
    })
    setProperties({ [propertyKey]: compound }, { mergeSubProperties: false })
  } else {
    // Fallback for unknown types
    setProperties({
      [propertyKey]: computedValue,
    })
  }
}
