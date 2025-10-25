/**
 * Properties Data Helpers
 *
 * This file provides UI-specific data transformation for the properties panel.
 * It delegates all business logic to core helpers and focuses on:
 * - Flattening hierarchical properties for UI display
 * - Adding UI-specific metadata (labels, icons, control types)
 * - Formatting values for display
 *
 * Core functions handle:
 * - Property inheritance and merging
 * - Status calculation
 * - Value formatting
 * - Preset matching and application
 * - Shorthand expansion
 *
 * Use core functions directly for business logic, use these helpers for UI transformation only.
 */
import {
  Board,
  Instance,
  Properties,
  PropertyKey,
  Theme,
  ValueType,
  Variant,
  Workspace,
} from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId } from "@seldon/core/components/constants"
import { findInObject } from "@seldon/core/helpers"
import {
  formatCompoundDisplay as coreFormatCompoundDisplay,
  formatShorthandDisplay as coreFormatShorthandDisplay,
  formatValue as coreFormatValue,
  getAllowedValues as coreGetAllowedValues,
  getEffectiveProperties as coreGetEffectiveProperties,
  getPropertyStatus as coreGetPropertyStatus,
} from "@seldon/core/helpers/properties/properties-ui-bridge"
import { getPropertyCategory } from "@seldon/core/properties/schemas"
import { validatePropertyValue } from "@seldon/core/properties/schemas/helpers"
import { isBoard } from "@seldon/core/workspace/helpers/is-board"
import { ControlType, getPropertyRegistryEntry } from "./properties-registry"
import { getAllPropertyKeys } from "./properties-registry-utils"
import { isCompoundProperty, isShorthandProperty } from "./property-types"
import {
  createSubPropertyLabel,
  formatPropertyLabel,
  getValueType,
} from "./shared-utils"

const EMPTY_VALUE = { type: ValueType.EMPTY, value: null }
const UNKNOWN_VALUE = "unknown"
const UNKNOWN_DISPLAY = "Error"

type PropertyStatus = "set" | "unset" | "override" | "not used" | "error"
type PropertyType = "atomic" | "compound" | "shorthand"

export interface FlatProperty {
  key: string
  propertyType: PropertyType
  label: string
  icon: string
  value: unknown
  actualValue: string
  valueType: ValueType
  controlType?: ControlType
  isCompound: boolean
  isShorthand: boolean
  isSubProperty: boolean
  allowedValues?: string[]
  isDimmed?: boolean
  status: PropertyStatus
}

/**
 * Filters keys for compound and shorthand properties
 * @param keys - Array of property keys to filter
 * @param propertyKey - The parent property key
 * @returns Filtered array of keys
 */
function filterCompoundPropertyKeys(
  keys: string[],
  propertyKey: string,
): string[] {
  let filteredKeys = keys

  if (isCompoundProperty(propertyKey)) {
    filteredKeys = filteredKeys.filter((key) => key !== "parameters")
  }

  if (isShorthandProperty(propertyKey)) {
    filteredKeys = filteredKeys.filter(
      (key) => key !== "type" && key !== "value",
    )
  }

  return filteredKeys
}

/**
 * Gets sub-property keys from a property object
 * @param obj - The property object
 * @param propertyKey - The parent property key
 * @returns Array of sub-property keys
 */
function getSubPropertyKeysFromObject(
  obj: unknown,
  propertyKey: string,
): string[] {
  if (!obj || typeof obj !== "object") {
    return []
  }
  return filterCompoundPropertyKeys(Object.keys(obj), propertyKey)
}

/**
 * Gets node properties with status information
 * @param node - The node to get properties for
 * @param workspace - Current workspace
 * @returns Object containing properties and property status
 */
export function getNodePropertiesWithStatus(
  node: Variant | Instance | Board,
  workspace: Workspace,
): { properties: Properties; propertyStatus: Record<string, PropertyStatus> } {
  const properties = coreGetEffectiveProperties(
    node.id,
    workspace as unknown as Workspace,
  )
  const propertyStatus = coreGetPropertyStatus(
    node.id,
    workspace as unknown as Workspace,
  ) as Record<string, PropertyStatus>

  return { properties, propertyStatus }
}

/**
 * Gets sub-properties for shorthand properties
 * @param propertyKey - The property key
 * @param propertyValue - The property value
 * @param workspace - Current workspace
 * @param node - The node
 * @param propertyStatus - Property status map
 * @param theme - Optional theme
 * @param mergedProperties - Optional pre-computed merged properties
 * @returns Array of flat properties
 */
function getShorthandSubProperties(
  propertyKey: string,
  workspace: Workspace,
  node: Variant | Instance | Board,
  propertyStatus: Record<string, PropertyStatus>,
  theme?: Theme,
  mergedProperties?: Properties,
): FlatProperty[] {
  let effectiveMergedProperties = mergedProperties
  if (!effectiveMergedProperties) {
    const result = getNodePropertiesWithStatus(node, workspace)
    effectiveMergedProperties = result.properties
  }

  const subEntries: string[] = []
  if (
    typeof effectiveMergedProperties === "object" &&
    !Array.isArray(effectiveMergedProperties)
  ) {
    for (const key of Object.keys(effectiveMergedProperties)) {
      if (key.startsWith(`${propertyKey}.`)) {
        const subKey = key.substring(propertyKey.length + 1)
        subEntries.push(subKey)
      }
    }
  }

  if (subEntries.length === 0) {
    const registryEntry = getPropertyRegistryEntry(propertyKey)
    if (registryEntry?.subProperties) {
      subEntries.push(...Object.keys(registryEntry.subProperties))
    }
  }

  const subProperties: FlatProperty[] = []

  for (const subKey of subEntries) {
    const subPropertyPath = `${propertyKey}.${subKey}`
    const subPropertyValue =
      typeof effectiveMergedProperties === "object" &&
      !Array.isArray(effectiveMergedProperties)
        ? findInObject(effectiveMergedProperties, subPropertyPath) ||
          EMPTY_VALUE
        : EMPTY_VALUE
    const subStatus = propertyStatus[subPropertyPath] || "not used"

    const flatSubProperty = createFlatSubProperty(
      propertyKey,
      subKey,
      subPropertyValue,
      subStatus,
      node,
      workspace,
      theme,
    )

    subProperties.push(flatSubProperty)
  }

  return subProperties
}

/**
 * Create a flat property from property data
 */
function createFlatProperty(
  propertyKey: string,
  propertyValue: unknown,
  status: PropertyStatus,
  node: Variant | Instance | Board,
  workspace: Workspace,
  theme?: Theme,
): FlatProperty {
  const registryEntry = getPropertyRegistryEntry(propertyKey)
  const isCompound = isCompoundProperty(propertyKey as PropertyKey)
  const isShorthand = isShorthandProperty(propertyKey as PropertyKey)

  let actualValue = UNKNOWN_VALUE
  let hasError = false

  if (isCompound) {
    try {
      actualValue = coreFormatCompoundDisplay(
        propertyKey,
        node.id,
        workspace,
        theme,
      )
    } catch {
      actualValue = UNKNOWN_DISPLAY
      hasError = true
    }
  } else if (isShorthand) {
    try {
      actualValue = coreFormatShorthandDisplay(
        propertyKey,
        node.id,
        workspace,
        theme,
      )
    } catch {
      actualValue = UNKNOWN_DISPLAY
      hasError = true
    }
  } else {
    try {
      actualValue = coreFormatValue(
        propertyKey,
        propertyValue,
        node.id,
        workspace,
        theme,
      )
    } catch {
      actualValue = UNKNOWN_DISPLAY
      hasError = true
    }
  }

  // Check for invalid property values using schema validation (after formatting)
  if (
    !hasError &&
    propertyValue &&
    typeof propertyValue === "object" &&
    propertyValue !== null &&
    "type" in propertyValue &&
    propertyValue.type === ValueType.EXACT &&
    "value" in propertyValue &&
    typeof propertyValue.value === "string"
  ) {
    // Extract the base property name (e.g., "background.color" -> "color")
    const basePropertyName = propertyKey.includes(".")
      ? propertyKey.split(".").pop()
      : propertyKey

    // Validate the property value against its schema
    if (
      basePropertyName &&
      !validatePropertyValue(
        basePropertyName,
        "exact",
        (propertyValue as Record<string, unknown>).value as string,
        theme,
      )
    ) {
      hasError = true
      actualValue = (propertyValue as Record<string, unknown>).value as string // Show the invalid value
    }
  }

  // Determine final status
  let finalStatus: PropertyStatus = status
  if (hasError) {
    finalStatus = "error"
  }

  return {
    key: propertyKey,
    label: registryEntry?.label || formatPropertyLabel(propertyKey),
    value: propertyValue || EMPTY_VALUE,
    actualValue,
    valueType: getValueType(propertyValue),
    controlType: registryEntry?.control,
    isCompound,
    isShorthand,
    isSubProperty: propertyKey.includes(".") && !isCompound && !isShorthand,
    propertyType: getPropertyCategory(propertyKey) || "atomic",
    status: finalStatus,
    allowedValues: (() => {
      try {
        return coreGetAllowedValues(
          propertyKey,
          node.id,
          workspace as unknown as Workspace,
        )
      } catch {
        return undefined
      }
    })(),
    icon: registryEntry?.icon || "IconTokenValue",
  }
}

/**
 * Create a flat sub-property
 */
function createFlatSubProperty(
  propertyKey: string,
  subKey: string,
  subValue: unknown,
  status: PropertyStatus,
  node: Variant | Instance | Board,
  workspace: Workspace,
  theme?: Theme,
): FlatProperty {
  const subPropertyPath = `${propertyKey}.${subKey}`
  const subRegistryEntry = getPropertyRegistryEntry(subPropertyPath)

  // Sub-properties should be dimmed if they have a computed value
  // For shorthand properties, computed values are set on each sub-property individually
  const isDimmed =
    subValue &&
    typeof subValue === "object" &&
    subValue !== null &&
    "type" in subValue &&
    subValue.type === ValueType.COMPUTED

  return {
    key: subPropertyPath,
    propertyType: "atomic", // Sub-properties are always atomic
    label: createSubPropertyLabel(propertyKey, subKey, subRegistryEntry?.label),
    icon: subRegistryEntry?.icon || "IconTokenValue",
    value: subValue || EMPTY_VALUE,
    actualValue: (() => {
      let hasError = false
      let actualValue = "unknown"

      try {
        actualValue = coreFormatValue(
          subPropertyPath,
          subValue,
          node.id,
          workspace,
          theme,
        )
      } catch {
        actualValue = "Error"
        hasError = true
      }

      // Check for invalid property values using schema validation (after formatting)
      if (
        !hasError &&
        subValue &&
        typeof subValue === "object" &&
        subValue !== null &&
        "type" in subValue &&
        subValue.type === ValueType.EXACT &&
        "value" in subValue &&
        typeof subValue.value === "string"
      ) {
        // Extract the base property name (e.g., "background.color" -> "color")
        const basePropertyName = subPropertyPath.includes(".")
          ? subPropertyPath.split(".").pop()
          : subPropertyPath

        // Validate the property value against its schema
        if (
          basePropertyName &&
          !validatePropertyValue(
            basePropertyName,
            "exact",
            (subValue as Record<string, unknown>).value as string,
            theme,
          )
        ) {
          hasError = true
          actualValue = (subValue as Record<string, unknown>).value as string // Show the invalid value
        }
      }

      return actualValue
    })(),
    valueType: getValueType(subValue),
    controlType: subRegistryEntry?.control,
    isCompound: false,
    isShorthand: false,
    isSubProperty: true,
    allowedValues: (() => {
      try {
        return coreGetAllowedValues(
          subPropertyPath,
          node.id,
          workspace as unknown as Workspace,
        )
      } catch {
        return undefined
      }
    })(),
    isDimmed: !!isDimmed,
    status: (() => {
      // Check if validation failed and set status to error
      if (
        subValue &&
        typeof subValue === "object" &&
        subValue !== null &&
        "type" in subValue &&
        subValue.type === ValueType.EXACT &&
        "value" in subValue &&
        typeof subValue.value === "string"
      ) {
        const basePropertyName = subPropertyPath.includes(".")
          ? subPropertyPath.split(".").pop()
          : subPropertyPath

        if (
          basePropertyName &&
          !validatePropertyValue(
            basePropertyName,
            "exact",
            (subValue as Record<string, unknown>).value as string,
            theme,
          )
        ) {
          return "error"
        }
      }
      return status
    })(),
  }
}

function getSubProperties(
  propertyKey: string,
  propertyValue: unknown,
  workspace: Workspace,
  node: Variant | Instance | Board,
  propertyStatus: Record<string, PropertyStatus>,
  theme?: Theme,
): FlatProperty[] {
  const subProperties: FlatProperty[] = []

  // Get sub-property keys from the actual property value
  const subPropertyKeys = getSubPropertyKeysFromObject(
    propertyValue,
    propertyKey,
  )

  for (const subKey of subPropertyKeys) {
    const subValue = (propertyValue as Record<string, unknown>)?.[subKey]
    const subPropertyPath = `${propertyKey}.${subKey}`
    const status = propertyStatus[subPropertyPath] || "not used"

    const flatSubProperty = createFlatSubProperty(
      propertyKey,
      subKey,
      subValue,
      status,
      node,
      workspace,
      theme,
    )

    subProperties.push(flatSubProperty)
  }

  return subProperties
}

// ============================================================================
// MAIN EXPORT FUNCTIONS
// ============================================================================

export function flattenNodeProperties(
  node: Variant | Instance | Board,
  workspace: Workspace,
  theme?: Theme,
): FlatProperty[] {
  const properties: FlatProperty[] = []
  const { properties: mergedProperties, propertyStatus } =
    getNodePropertiesWithStatus(node, workspace)

  // Get schema properties to filter which properties to show
  // Boards always use the Board schema, regardless of their component field
  const componentId = isBoard(node) ? ComponentId.BOARD : node.component
  const schema = getComponentSchema(componentId)
  const schemaPropertyKeys = schema ? Object.keys(schema.properties) : []

  // Only show properties that are defined in the component schema
  const allPropertyKeys = getAllPropertyKeys().filter((propertyKey) =>
    schemaPropertyKeys.includes(propertyKey),
  )

  for (const propertyKey of allPropertyKeys) {
    const propertyValue = findInObject(mergedProperties, propertyKey)
    const status = propertyStatus[propertyKey] || "not used"
    const finalPropertyValue = propertyValue || EMPTY_VALUE

    const flatProperty = createFlatProperty(
      propertyKey,
      finalPropertyValue,
      status,
      node,
      workspace,
      theme,
    )

    properties.push(flatProperty)

    if (flatProperty.isCompound) {
      const subProperties = getSubProperties(
        propertyKey,
        finalPropertyValue,
        workspace,
        node,
        propertyStatus,
        theme,
      )
      properties.push(...subProperties)
    } else if (flatProperty.isShorthand) {
      const subProperties = getShorthandSubProperties(
        propertyKey,
        workspace,
        node,
        propertyStatus,
        theme,
        mergedProperties, // Pass merged properties to avoid re-calling getNodePropertiesWithStatus
      )
      properties.push(...subProperties)
    }
  }

  return properties
}
