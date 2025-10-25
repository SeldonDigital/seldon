/**
 * Properties Registry Helper Functions
 *
 * This file contains utility functions for querying and working with the property registry.
 * It provides functions to filter, search, and extract information from the registry.
 */
import { ComputedFunction, Theme } from "@seldon/core"
import { getPropertySchema } from "@seldon/core/properties/schemas"
import {
  ControlType,
  PROPERTY_REGISTRY,
  PropertyRegistryEntry,
} from "./properties-registry"

/**
 * Gets all top-level property keys
 * @returns Array of property keys
 */
export function getAllPropertyKeys(): string[] {
  return Object.keys(PROPERTY_REGISTRY)
}

/**
 * Gets all property paths including nested sub-properties
 * @returns Array of all property paths
 */
export function getAllPropertyPaths(): string[] {
  const paths: string[] = []

  function collectPaths(prefix: string, entry: PropertyRegistryEntry) {
    paths.push(prefix)
    if (entry.subProperties) {
      Object.entries(entry.subProperties).forEach(([key, subEntry]) => {
        collectPaths(`${prefix}.${key}`, subEntry)
      })
    }
  }

  Object.entries(PROPERTY_REGISTRY).forEach(([key, entry]) => {
    collectPaths(key, entry)
  })

  return paths
}

/**
 * Gets all properties with a specific control type
 * @param control - The control type to filter by
 * @returns Array of property keys matching the control type
 */
export function getPropertiesByControl(control: ControlType): string[] {
  const result: string[] = []

  function collectByControl(prefix: string, entry: PropertyRegistryEntry) {
    if (entry.control === control) {
      result.push(prefix)
    }
    if (entry.subProperties) {
      Object.entries(entry.subProperties).forEach(([key, subEntry]) => {
        collectByControl(`${prefix}.${key}`, subEntry)
      })
    }
  }

  Object.entries(PROPERTY_REGISTRY).forEach(([key, entry]) => {
    collectByControl(key, entry)
  })

  return result
}

/**
 * Checks if a property supports inheritance
 * @param propertyName - The property name to check
 * @returns True if the property supports inheritance
 */
export function getPropertySupportsInherit(propertyName: string): boolean {
  const schema = getPropertySchema(propertyName)
  return schema?.supports.includes("inherit") ?? false
}

/**
 * Gets computed functions supported by a property
 * @param propertyName - The property name to check
 * @returns Array of supported computed functions
 */
export function getPropertyComputedFunctions(
  propertyName: string,
): ComputedFunction[] {
  const schema = getPropertySchema(propertyName)
  return schema?.computedFunctions?.() ?? []
}

/**
 * Gets preset options for a property
 * @param propertyName - The property name to get presets for
 * @returns Array of preset options
 */
export function getPropertyPresetOptions(propertyName: string): unknown[] {
  const schema = getPropertySchema(propertyName)
  return schema?.presetOptions?.() ?? []
}

/**
 * Gets theme options for a property (categorical)
 * @param propertyName - The property name to get theme keys for
 * @param theme - Optional theme for key resolution
 * @returns Array of categorical theme keys
 */
export function getPropertyThemeCategoricalKeys(
  propertyName: string,
  theme?: Theme,
): string[] {
  const schema = getPropertySchema(propertyName)
  return theme ? (schema?.themeCategoricalKeys?.(theme) ?? []) : []
}

/**
 * Gets theme options for a property (ordinal)
 * @param propertyName - The property name to get theme keys for
 * @param theme - Optional theme for key resolution
 * @returns Array of ordinal theme keys
 */
export function getPropertyThemeOrdinalKeys(
  propertyName: string,
  theme?: Theme,
): string[] {
  const schema = getPropertySchema(propertyName)
  return theme ? (schema?.themeOrdinalKeys?.(theme) ?? []) : []
}

/**
 * Gets all supported value types for a property
 * @param propertyName - The property name to get supported types for
 * @returns Array of supported value types
 */
export function getPropertySupportedValueTypes(propertyName: string): string[] {
  const schema = getPropertySchema(propertyName)
  return schema?.supports ? [...schema.supports] : []
}
