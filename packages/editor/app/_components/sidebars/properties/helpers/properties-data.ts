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
import { isComponentId } from "@seldon/core/components/constants"
import { findInObject } from "@seldon/core/helpers"
import { isLayeredPaintProperty } from "@seldon/core/properties/types/property-keys"
import type {
  LayeredPaintKey,
  PropertyKey as CorePropertyKey,
} from "@seldon/core/properties/types/property-keys"
import {
  getCompoundLayerValue,
  isLayeredPaintRoot,
  layeredFacetPath,
} from "@lib/properties/property-paths"
import { getComponentPropertyDefaults } from "@seldon/core/workspace/helpers/components/get-component-property-defaults"
import { getNodeCatalogComponentId } from "@lib/workspace/node-tree"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import {
  formatCompoundDisplay as coreFormatCompoundDisplay,
  formatShorthandDisplay as coreFormatShorthandDisplay,
  formatValue as coreFormatValue,
  getCompoundPropertyStructure,
  getEffectiveProperties as coreGetEffectiveProperties,
  getPropertyStatus as coreGetPropertyStatus,
} from "@seldon/core/helpers/properties/properties-bridge"
import {
  getCompoundSubPropertySchema,
  getPropertyCategory,
} from "@seldon/core/properties/schemas"
import { getPresetOptions } from "@seldon/core/properties/schemas/helpers/property-options"
import {
  getCatalogKeyForPropertyPath,
  getInspectorRootPropertyKeys,
  getPropertySchema,
  validatePropertyValue,
} from "@seldon/core/properties/schemas/helpers"
import { isComponentEntry } from "@seldon/core/workspace/helpers/components/is-component-entry"
import { ControlType, getPropertyRegistryEntry } from "./properties-registry"
import { isCompoundProperty, isShorthandProperty } from "./property-types"
import {
  createSubPropertyLabel,
  formatPropertyLabel,
  getValueType,
} from "./shared-utils"

const EMPTY_VALUE = { type: ValueType.EMPTY, value: null }
const UNKNOWN_VALUE = "unknown"
const UNKNOWN_DISPLAY = "Error"

function facetAllowsAuthoredComputed(subPropertyPath: string): boolean {
  const catalogKey = getCatalogKeyForPropertyPath(subPropertyPath)
  if (!catalogKey) return false
  const schema = getPropertySchema(catalogKey)
  return schema?.supports.includes("computed") ?? false
}

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
  pickerVariant?: "themeAssignment"
  isDimmed?: boolean
  status: PropertyStatus
  /** Theme color-point rows set this for swatch icon preview in the properties tree. */
  iconColorValue?: string
}

/**
 * Checks if a compound property has preset options available in the theme
 * @param propertyKey - The compound property key (e.g., "background", "border")
 * @param theme - Optional theme to check for preset options
 * @returns True if the theme has a section for this property with preset options
 */
export function hasCompoundPresetOptions(
  propertyKey: string,
  theme?: Theme,
  workspace?: Workspace,
): boolean {
  if (!isCompoundProperty(propertyKey)) {
    return false
  }

  const presetSchema = getCompoundSubPropertySchema(propertyKey, "preset")
  if (presetSchema?.presetOptions) {
    const presetSchemaKey = `${propertyKey}${"preset".charAt(0).toUpperCase()}${"preset".slice(1)}`
    if (getPresetOptions(presetSchemaKey, workspace).length > 0) {
      return true
    }
  }

  if (!theme) {
    return false
  }

  // Check if theme has a section for this property (e.g., theme.background, theme.border)
  const section = (theme as Record<string, unknown>)[propertyKey]
  if (!section || typeof section !== "object") {
    return false
  }

  // Check if the section has any preset entries (objects with a "name" property)
  const entries = Object.entries(section)
  return entries.some(
    ([, v]: [string, unknown]) => v && typeof v === "object" && "name" in v,
  )
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

function subPropertyPathFor(parentKey: string, subKey: string): string {
  if (isLayeredPaintRoot(parentKey)) {
    return layeredFacetPath(parentKey as LayeredPaintKey, subKey)
  }
  return `${parentKey}.${subKey}`
}

export function getPropertiesSubjectId(node: Variant | Instance | Board): string {
  if (isComponentEntry(node)) return getComponentKey(node)
  return node.id
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
  const subjectId = getPropertiesSubjectId(node)
  const properties = coreGetEffectiveProperties(
    subjectId,
    workspace as unknown as Workspace,
  )
  const propertyStatus = coreGetPropertyStatus(
    subjectId,
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
export function createFlatProperty(
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
        getPropertiesSubjectId(node),
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
        getPropertiesSubjectId(node),
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
        getPropertiesSubjectId(node),
        workspace,
        theme,
      )
    } catch {
      actualValue = UNKNOWN_DISPLAY
      hasError = true
    }
  }

  // Check for invalid property values using schema validation (after formatting)
  // Skip validation for combo controls with custom values (they allow any string)
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

    // Skip validation for combo controls - they allow custom values
    // Also skip validation for image properties (source and background.image - no schema exists, and they should accept any URL)
    const isComboControl = registryEntry?.control === "combo"
    const isImageProperty =
      basePropertyName === "source" || basePropertyName === "image"
    const isBackgroundImageProperty =
      basePropertyName === "image" && propertyKey.startsWith("background")

    // Validate the property value against its schema
    if (
      !isComboControl &&
      !isImageProperty &&
      !isBackgroundImageProperty &&
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

  const usesCompoundPresetPicker =
    isCompound && hasCompoundPresetOptions(propertyKey, theme, workspace)

  return {
    key: propertyKey,
    label: registryEntry?.label || formatPropertyLabel(propertyKey),
    value: propertyValue || EMPTY_VALUE,
    actualValue,
    valueType: getValueType(propertyValue),
    controlType: usesCompoundPresetPicker ? "combo" : registryEntry?.control,
    isCompound,
    isShorthand,
    isSubProperty: propertyKey.includes(".") && !isCompound && !isShorthand,
    propertyType: getPropertyCategory(propertyKey) || "atomic",
    status: finalStatus,
    icon: registryEntry?.icon || "IconTokenValue",
  }
}

/**
 * Create a flat sub-property
 */
export function createFlatSubProperty(
  propertyKey: string,
  subKey: string,
  subValue: unknown,
  status: PropertyStatus,
  node: Variant | Instance | Board,
  workspace: Workspace,
  theme?: Theme,
): FlatProperty {
  const subPropertyPath = subPropertyPathFor(propertyKey, subKey)
  const subRegistryEntry = getPropertyRegistryEntry(subPropertyPath)

  const isDimmed =
    subValue &&
    typeof subValue === "object" &&
    subValue !== null &&
    "type" in subValue &&
    subValue.type === ValueType.COMPUTED &&
    !facetAllowsAuthoredComputed(subPropertyPath)

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
          getPropertiesSubjectId(node),
          workspace,
          theme,
        )
      } catch {
        actualValue = "Error"
        hasError = true
      }

      // Check for invalid property values using schema validation (after formatting)
      // Skip validation for combo controls with custom values (they allow any string)
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

        // Skip validation for combo controls - they allow custom values
        // Also skip validation for source property (no schema exists, and it should accept any URL)
        const isComboControl = subRegistryEntry?.control === "combo"
        const isSourceProperty = basePropertyName === "source"

        // Validate the property value against its schema
        if (
          !isComboControl &&
          !isSourceProperty &&
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
    isDimmed: !!isDimmed,
    status: (() => {
      // Check if validation failed and set status to error
      // Skip validation for combo controls with custom values (they allow any string)
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

        // Skip validation for combo controls - they allow custom values
        // Also skip validation for image properties (source and background.image - no schema exists, and they should accept any URL)
        const isComboControl = subRegistryEntry?.control === "combo"
        const isImageProperty =
          basePropertyName === "source" || basePropertyName === "image"
        const isBackgroundImageProperty =
          basePropertyName === "image" && subPropertyPath.startsWith("background")

        if (
          !isComboControl &&
          !isImageProperty &&
          !isBackgroundImageProperty &&
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
  mergedProperties?: Properties,
): FlatProperty[] {
  const subProperties: FlatProperty[] = []

  const compoundValue =
    mergedProperties !== undefined
      ? (resolvePropertyValueForDisplay(mergedProperties, propertyKey) ??
        propertyValue)
      : propertyValue

  const subPropertyKeys = filterCompoundPropertyKeys(
    getCompoundPropertyStructure(
      propertyKey,
      compoundValue,
      node,
      workspace,
    ),
    propertyKey,
  )

  // Check if this compound property has preset options in the theme
  // If so, filter out the "preset" sub-property to avoid duplicate controls
  const hasPresetOptions = hasCompoundPresetOptions(
    propertyKey,
    theme,
    workspace,
  )

  for (const subKey of subPropertyKeys) {
    // Skip the preset sub-property if the parent compound property has preset options
    // The preset menu will be shown on the parent property instead
    if (subKey === "preset" && hasPresetOptions) {
      continue
    }

    const layer = getCompoundLayerValue(compoundValue)
    const subValue = layer?.[subKey]
    const subPropertyPath = subPropertyPathFor(propertyKey, subKey)
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

function getSchemaPropertyKeysForSubject(
  node: Variant | Instance | Board,
  workspace: Workspace,
): string[] {
  if (isComponentEntry(node)) {
    return Object.keys(getComponentPropertyDefaults())
  }

  const catalogId = getNodeCatalogComponentId(node, workspace)
  if (catalogId && isComponentId(catalogId)) {
    return Object.keys(getComponentSchema(catalogId).properties)
  }

  return []
}

function resolvePropertyValueForDisplay(
  mergedProperties: Properties,
  propertyKey: string,
): unknown {
  const direct = findInObject(mergedProperties, propertyKey)
  if (direct !== undefined && direct !== null) {
    return direct
  }

  if (isLayeredPaintProperty(propertyKey as CorePropertyKey)) {
    return getCompoundLayerValue(
      mergedProperties[propertyKey as keyof Properties],
    )
  }

  return undefined
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

  const schemaPropertyKeys = getSchemaPropertyKeysForSubject(node, workspace)

  // Iterate the full catalog of top-level inspector rows. Keys not on the subject's
  // schema get status "not used" and are filtered out unless unused rows are shown.
  const allPropertyKeys = getInspectorRootPropertyKeys()

  for (const propertyKey of allPropertyKeys) {
    const propertyValue = resolvePropertyValueForDisplay(
      mergedProperties,
      propertyKey,
    )
    // If property is not in schema, it should have status "not used"
    // Otherwise use the status from propertyStatus
    const isInSchema = schemaPropertyKeys.includes(propertyKey)
    const status = isInSchema
      ? propertyStatus[propertyKey] || "unset"
      : "not used"
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
        mergedProperties,
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
