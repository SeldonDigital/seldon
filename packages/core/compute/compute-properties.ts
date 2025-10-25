import { isCompoundProperty } from "../helpers/type-guards/compound/is-compound-property"
import {
  CompoundPropertyKey,
  ComputedAutoFitValue,
  ComputedFunction,
  ComputedHighContrastValue,
  ComputedMatchValue,
  ComputedOpticalPaddingValue,
  ComputedValue,
  Properties,
  PropertyKey,
  SubPropertyKey,
  Value,
  ValueType,
} from "../index"
import { computeAutoFit } from "./compute-auto-fit"
import { computeHighContrastColor } from "./compute-high-contrast-color"
import { computeMatch } from "./compute-match"
import { computeOpticalPadding } from "./compute-optical-padding"
import { ComputeContext, ComputeKeys } from "./types"

/**
 * Safely access compound property values
 */
function getCompoundPropertyValue<T extends CompoundPropertyKey>(
  properties: Properties,
  key: T,
): Properties[T] | undefined {
  return properties[key]
}

/**
 * Safely set compound property values
 */
function setCompoundPropertyValue<T extends CompoundPropertyKey>(
  properties: Properties,
  key: T,
  value: Properties[T],
): void {
  properties[key] = value
}

/**
 * Safely access sub-property values within compound properties
 */
function getSubPropertyValue(
  compoundValue: Record<string, Value>,
  subKey: string,
): Value | undefined {
  return compoundValue[subKey]
}

/**
 * Safely set sub-property values within compound properties
 */
function setSubPropertyValue(
  compoundValue: Record<string, Value>,
  subKey: string,
  value: Value,
): void {
  compoundValue[subKey] = value
}

/**
 * Computes all computed values in a properties object, handling both primitive and compound properties.
 * Processes computed values through their respective computation functions.
 *
 * @param properties - The properties object containing computed values to process
 * @param context - The computation context containing theme and parent data
 * @returns A new properties object with all computed values resolved
 */
export function computeProperties(
  properties: Properties,
  context: ComputeContext,
): Properties {
  const computedProperties: Properties = {}

  Object.entries(properties).forEach(([k, value]) => {
    const propertyKey = k as PropertyKey

    if (isCompoundProperty(propertyKey)) {
      const compoundValue = value as Record<string, Value>
      Object.entries(compoundValue).forEach(([sk, subpropertyValue]) => {
        const subPropertyKey = sk as SubPropertyKey

        if (!getCompoundPropertyValue(computedProperties, propertyKey)) {
          setCompoundPropertyValue(
            computedProperties,
            propertyKey,
            {} as Properties[typeof propertyKey],
          )
        }

        const currentCompoundValue = getCompoundPropertyValue(
          computedProperties,
          propertyKey,
        ) as Record<string, Value>

        if (
          subpropertyValue &&
          typeof subpropertyValue === "object" &&
          "type" in subpropertyValue &&
          subpropertyValue.type === ValueType.COMPUTED
        ) {
          const computedValue = computeValue(
            subpropertyValue as ComputedValue,
            context,
            {
              propertyKey,
              subPropertyKey: subPropertyKey,
            },
          )
          setSubPropertyValue(
            currentCompoundValue,
            subPropertyKey,
            computedValue,
          )
        } else {
          setSubPropertyValue(
            currentCompoundValue,
            subPropertyKey,
            subpropertyValue as Value,
          )
        }
      })
    } else {
      if (
        value &&
        typeof value === "object" &&
        "type" in value &&
        value.type === ValueType.COMPUTED
      ) {
        const computedValue = value as ComputedValue
        const computedResult = computeValue(computedValue, context, {
          propertyKey,
        })
        // Use Object.assign to avoid complex union type issues
        Object.assign(computedProperties, { [propertyKey]: computedResult })
      } else {
        // Use Object.assign to avoid complex union type issues
        Object.assign(computedProperties, { [propertyKey]: value })
      }
    }
  })

  return computedProperties
}

/**
 * Routes computed values to their appropriate computation functions
 *
 * @param value - The computed value to process
 * @param context - The computation context
 * @param keys - The computation keys containing property information
 * @returns The resolved value from the computation function
 */
function computeValue(
  value: ComputedValue,
  context: ComputeContext,
  keys: ComputeKeys,
): Value {
  if (value.type !== ValueType.COMPUTED) {
    throw new Error("Value is not a computed value")
  }

  const functionType = value.value.function
  switch (functionType) {
    case ComputedFunction.HIGH_CONTRAST_COLOR:
      return computeHighContrastColor(
        value as ComputedHighContrastValue,
        context,
      ) as Value
    case ComputedFunction.OPTICAL_PADDING:
      return computeOpticalPadding(
        value as ComputedOpticalPaddingValue,
        context,
        keys,
      ) as Value
    case ComputedFunction.AUTO_FIT:
      return computeAutoFit(value as ComputedAutoFitValue, context) as Value
    case ComputedFunction.MATCH:
      return computeMatch(value as ComputedMatchValue, context) as Value
    default:
      throw new Error(`Unknown computed function: ${functionType}`)
  }
}
