import { IconId, iconIds } from "../../components/icons"
import { NestedOverrides } from "../../components/types"
import { Properties, ValueType } from "../../properties"
import { getValueType } from "../type-guards/value"
import { flattenNestedOverridesObject } from "./flatten-nested-overrides-object"

/**
 * Helper function to safely set properties on the processed properties object
 */
function setProcessedProperty(
  processedProperties: Properties,
  key: keyof Properties,
  value: any,
): void {
  ;(processedProperties as any)[key] = value
}

/**
 * Process nestedOverrides props by applying parent nestedOverrides values to child component properties.
 * Only allows overrides for properties that are explicitly declared in the child component's schema.
 * Supports both nested object format and flattened dot notation format.
 *
 * Theme values are automatically detected and assigned appropriate types using precalculated mappings.
 *
 * @param properties - The properties to process (from child component schema)
 * @param nestedOverrides - The nestedOverrides props from the parent component (optional)
 * @param componentId - The ID of the child component being processed
 * @param propertyPath - The current property path for nested properties
 * @returns The processed properties with nestedOverrides applied
 */
export function processNestedOverridesProps(
  properties: Properties,
  nestedOverrides?: NestedOverrides,
  componentId?: string,
  propertyPath: string = "",
  rootProperties?: Properties,
): Properties {
  const processedProperties: Properties = {}

  // Set root properties for property existence checks
  const rootProps = rootProperties || properties

  // Only process nestedOverrides at the root level (when propertyPath is empty)
  // This prevents double-processing during recursive calls
  let processedNestedOverrides: Record<string, any> | undefined =
    nestedOverrides
  if (nestedOverrides && propertyPath === "") {
    // Check if this is already flat dot notation or needs to be flattened
    const hasFlatDotNotation = Object.keys(nestedOverrides).some((key) =>
      key.includes("."),
    )

    if (hasFlatDotNotation) {
      processedNestedOverrides = nestedOverrides as Record<string, any>
    } else {
      // Convert nested objects to flattened dot notation
      processedNestedOverrides = flattenNestedOverridesObject(nestedOverrides)
    }
  }

  Object.entries(properties).forEach(([key, value]) => {
    const propertyKey = key as keyof Properties
    const currentPath = propertyPath
      ? `${propertyPath}.${String(propertyKey)}`
      : String(propertyKey)

    if (typeof value === "object" && value && !("value" in value)) {
      // Handle nested properties recursively
      setProcessedProperty(
        processedProperties,
        propertyKey,
        processNestedOverridesProps(
          value as Properties,
          processedNestedOverrides,
          componentId,
          currentPath,
          rootProps,
        ),
      )
    } else {
      // Check if this property should be overridden by the parent
      if (componentId && processedNestedOverrides) {
        // Convert dot notation to camelCase for the nestedOverrides key
        // e.g., "font.size" becomes "fontSize"
        const camelCasePath = currentPath.replace(/\.([a-z])/g, (_, letter) =>
          letter.toUpperCase(),
        )
        const nestedOverridesKey = `${componentId}.${camelCasePath}`

        // Check for both the exact path and the camelCase version
        const exactNestedOverridesKey = `${componentId}.${currentPath}`
        const foundNestedOverridesKey =
          nestedOverridesKey in processedNestedOverrides
            ? nestedOverridesKey
            : exactNestedOverridesKey in processedNestedOverrides
              ? exactNestedOverridesKey
              : null

        if (foundNestedOverridesKey) {
          // Only allow override if this property is declared in the child component's schema
          // This prevents unauthorized property overrides
          const nestedOverridesValue =
            processedNestedOverrides[foundNestedOverridesKey]

          // Check if this property exists in the child component's schema
          // If it doesn't exist, skip the override to maintain security
          // We need to check from the root properties, not the current nested object
          const propertyExists = currentPath.split(".").reduce((obj, key) => {
            return obj && typeof obj === "object" && key in obj
              ? (obj as any)[key]
              : undefined
          }, rootProps)

          if (propertyExists !== undefined) {
            // Property exists in schema, safe to override
            // Handle different types of nestedOverrides values
            if (
              typeof nestedOverridesValue === "string" &&
              (nestedOverridesValue as string).startsWith("@")
            ) {
              // Theme values
              const valueType = getValueType(nestedOverridesValue as string)
              setProcessedProperty(processedProperties, propertyKey, {
                type: valueType,
                value: nestedOverridesValue,
              })
            } else if (
              typeof nestedOverridesValue === "string" &&
              iconIds.includes(nestedOverridesValue as IconId)
            ) {
              // Icon IDs
              setProcessedProperty(processedProperties, propertyKey, {
                type: ValueType.PRESET,
                value: nestedOverridesValue,
              })
            } else if (
              typeof nestedOverridesValue === "object" &&
              nestedOverridesValue !== null &&
              "unit" in nestedOverridesValue &&
              "value" in nestedOverridesValue
            ) {
              // Complex values with unit and value (e.g., { unit: "rem", value: 2 })
              setProcessedProperty(processedProperties, propertyKey, {
                type: ValueType.EXACT,
                value: nestedOverridesValue,
              })
            } else {
              // Simple values (strings, numbers, booleans, etc.)
              setProcessedProperty(processedProperties, propertyKey, {
                type: ValueType.EXACT,
                value: nestedOverridesValue,
              })
            }
          } else {
            // Property doesn't exist in schema, ignore the nestedOverrides override
            // Keep the original property value for security
            setProcessedProperty(processedProperties, propertyKey, value)
          }
        } else {
          setProcessedProperty(processedProperties, propertyKey, value)
        }
      } else {
        setProcessedProperty(processedProperties, propertyKey, value)
      }
    }
  })

  return processedProperties
}
