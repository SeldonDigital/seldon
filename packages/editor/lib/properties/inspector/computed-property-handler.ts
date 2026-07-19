/**
 * Handles computed value changes for property controls
 */
import { parsePropertyPath } from "@seldon/editor/lib/properties/property-paths"
import { ComputedFunction, Properties, Value, Workspace } from "@seldon/core"
import { Board, Instance, Variant } from "@seldon/core"
import { getEffectiveProperties as coreGetEffectiveProperties } from "@seldon/core/helpers/properties/properties-bridge"
import { getPropertyCategory } from "@seldon/core/properties/schemas"
import { canApplyComputedSafely, createComputedValue } from "./computed-utils"
import { FlatProperty, getPropertiesSubjectId } from "./properties-data"
import { getSubPropertyKeys } from "@seldon/editor/lib/properties/property-types"

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

    // A layered-paint facet (`background.0.color`, `shadow.0.color`) is not a
    // plain two-segment compound. Write the computed value into its layer slot
    // and persist the full stack as an array so the paint property keeps its
    // layered shape. The generic sub-property path below would collapse the key
    // to two segments and store the root as an object, breaking the layer.
    const parsed = parsePropertyPath(property.key)
    if (parsed.kind === "layered-facet" && selection) {
      const computedValue = createComputedValue(computedFunction)

      const current = coreGetEffectiveProperties(
        getPropertiesSubjectId(selection),
        workspace,
      )[parsed.root as keyof Properties]
      const layers = Array.isArray(current)
        ? [...(current as Array<Record<string, unknown>>)]
        : current
          ? [current as Record<string, unknown>]
          : []
      while (layers.length <= parsed.index) layers.push({})
      layers[parsed.index] = {
        ...(layers[parsed.index] as Record<string, unknown>),
        [parsed.facet]: computedValue,
      }

      setProperties({ [parsed.root]: layers }, { mergeSubProperties: false })
      return true
    }

    // Apply computed value based on property type
    if (property.isSubProperty) {
      const [compoundKey, subKey] = property.key.split(".")
      const computedValue = createComputedValue(computedFunction)
      setProperties({
        [compoundKey]: {
          ...cleanCompoundValue(property.value),
          [subKey]: computedValue,
        },
      })
    } else {
      const computedValue = createComputedValue(computedFunction)
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
