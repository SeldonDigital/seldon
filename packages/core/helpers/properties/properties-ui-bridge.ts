import { Properties, PropertyKey, Theme, ValueType } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId } from "@seldon/core/components/constants"
import { removeAllowedValuesFromProperties } from "@seldon/core/helpers/properties/remove-allowed-values"
import { ComputedFunction } from "@seldon/core/properties/constants"
import { getNodeById } from "@seldon/core/workspace/helpers/get-node-by-id"
import { isBoard } from "@seldon/core/workspace/helpers/is-board"
import {
  Board,
  Instance,
  Variant,
  Workspace,
} from "@seldon/core/workspace/types"
import { COMPUTED_FUNCTION_DISPLAY_NAMES } from "../../compute"
import { getPropertyCategory } from "../../properties/schemas"
import { getThemeValueName } from "../theme/get-theme-value-name"

/**
 * Core-facing helpers providing effective properties, status, allowed values,
 * and formatting for use by the editor properties panel.
 *
 * This module serves as the bridge between the core property system and the UI,
 * handling property inheritance, status calculation, value formatting, and preset management.
 */

// ============================================================================
// TYPED HELPERS - Extract common patterns to reduce duplication
// ============================================================================

/**
 * Retrieves a typed node from the workspace by ID.
 *
 * @param nodeId - The ID of the node to retrieve
 * @param workspace - The workspace containing the node
 * @returns The typed node (Variant, Instance, or Board)
 */
function getTypedNode(
  nodeId: string,
  workspace: Workspace,
): Variant | Instance | Board {
  // First check if it's a board
  const board = workspace.boards[nodeId as ComponentId]
  if (board) {
    return board
  }

  // Otherwise, it's a node in byId
  return getNodeById(nodeId as unknown as any, workspace) as Variant | Instance
}

/**
 * Gets a specific property from the node's schema properties.
 *
 * @param node - The node to get schema properties from
 * @param propertyKey - The property key to retrieve
 * @returns The schema property value or undefined
 */
function getSchemaProperty(
  node: Variant | Instance | Board,
  propertyKey: string,
) {
  const schemaProperties = getSchemaProperties(node)
  return schemaProperties?.[propertyKey as keyof typeof schemaProperties]
}

/**
 * Checks if a node has overridden a specific property or sub-property.
 *
 * @param node - The node to check
 * @param key - The property key to check
 * @param subKey - Optional sub-property key to check
 * @returns True if the property is overridden, false otherwise
 */
function hasPropertyOverride(
  node: Variant | Instance | Board,
  key: string,
  subKey?: string,
): boolean {
  if (!node.properties || !(key in node.properties)) return false

  const propertyValue = (node.properties as any)[key]
  if (!propertyValue || typeof propertyValue !== "object") return false

  if (subKey) {
    return subKey in propertyValue
  }

  return true
}

/**
 * Checks if a property value is empty (null, undefined, or EMPTY type).
 *
 * @param value - The value to check
 * @returns True if the value is empty, false otherwise
 */
function isValueEmpty(value: any): boolean {
  return (
    !value ||
    (typeof value === "object" &&
      "type" in value &&
      value.type === ValueType.EMPTY)
  )
}

/**
 * Checks if a property value is set (not empty).
 *
 * @param value - The value to check
 * @returns True if the value is set, false otherwise
 */
function isValueSet(value: any): boolean {
  return (
    value &&
    typeof value === "object" &&
    "type" in value &&
    value.type !== ValueType.EMPTY
  )
}

/**
 * Checks if a schema has a specific sub-property defined.
 *
 * @param schemaProperties - The schema properties to check
 * @param key - The parent property key
 * @param subKey - The sub-property key
 * @returns True if the sub-property exists in the schema, false otherwise
 */
function hasSchemaSubProperty(
  schemaProperties: Properties,
  key: string,
  subKey: string,
): boolean {
  return !!(
    schemaProperties &&
    key in schemaProperties &&
    (schemaProperties as any)[key] &&
    typeof (schemaProperties as any)[key] === "object" &&
    subKey in (schemaProperties as any)[key]
  )
}

/**
 * Gets the effective properties for a node, including inherited properties from parent instances and schema defaults.
 *
 * This function builds a complete property inheritance chain and merges all properties
 * to return the final effective properties that should be used for rendering.
 *
 * @param nodeId - The ID of the node to get properties for
 * @param workspace - The workspace containing the node
 * @returns The effective properties with all inheritance resolved
 *
 * @example
 * ```typescript
 * const effectiveProps = getEffectiveProperties("variant-button-default", workspace)
 * // Returns merged properties from node overrides, parent instances, and schema defaults
 * ```
 */
export function getEffectiveProperties(
  nodeId: string,
  workspace: Workspace,
): Properties {
  const node = getTypedNode(nodeId, workspace)
  const schemaProps = getSchemaProperties(node)
  if (!schemaProps) return node.properties || {}

  const chain = buildInheritanceChain(node, workspace, schemaProps)
  return mergeInheritanceChain(chain)
}

/**
 * Gets the status of all properties for a node, indicating whether each property is set, unset, overridden, or not used.
 *
 * Property statuses:
 * - "set": Property has a value from schema defaults
 * - "unset": Property is empty or not defined
 * - "override": Property has been explicitly overridden by the node
 * - "not used": Property is not defined in the schema
 *
 * @param nodeId - The ID of the node to get property status for
 * @param workspace - The workspace containing the node
 * @returns A record mapping property keys to their status
 *
 * @example
 * ```typescript
 * const status = getPropertyStatus("variant-button-default", workspace)
 * // Returns: { "color": "set", "fontSize": "override", "margin": "unset" }
 * ```
 */
export function getPropertyStatus(
  nodeId: string,
  workspace: Workspace,
): Record<string, "set" | "unset" | "override" | "not used"> {
  const node = getTypedNode(nodeId, workspace)
  const schemaProperties = getSchemaProperties(node)
  const status: Record<string, "set" | "unset" | "override" | "not used"> = {}
  if (!schemaProperties) return status

  const effective = getEffectiveProperties(nodeId, workspace)

  for (const key of Object.keys(effective)) {
    const hasNodeOverride = hasPropertyOverride(node, key)
    const hasSchemaDefault = key in schemaProperties
    const nodeValue = hasNodeOverride ? (node.properties as any)[key] : null
    const schemaValue = hasSchemaDefault ? (schemaProperties as any)[key] : null

    status[key] = calculatePropertyStatus(
      key,
      hasNodeOverride,
      hasSchemaDefault,
      nodeValue,
      schemaValue,
      node,
      workspace,
    )

    // Handle compound properties
    if (isCompoundProperty(key as PropertyKey)) {
      const compoundValue = (effective as any)[key]
      if (compoundValue && typeof compoundValue === "object") {
        const subKeys = getCompoundPropertyStructure(key, compoundValue, node)
        for (const subKey of subKeys) {
          const hasSubDefault = hasSchemaSubProperty(
            schemaProperties,
            key,
            subKey,
          )
          const schemaSubValue = hasSubDefault
            ? (schemaProperties as any)[key]?.[subKey]
            : null

          status[`${key}.${subKey}`] = calculateSubPropertyStatus(
            key,
            subKey,
            hasSubPropertyOverride(node, key, subKey, workspace),
            hasSubDefault,
            compoundValue,
            schemaSubValue,
            node,
            workspace,
          )
        }
      }
    }

    // Handle shorthand properties
    if (isShorthandProperty(key as PropertyKey)) {
      const subKeys = getSubPropertyKeysFromSchema(key, node)
      const subStatuses: PropertyStatus[] = []

      for (const subKey of subKeys) {
        const hasSubDefault = hasSchemaSubProperty(
          schemaProperties,
          key,
          subKey,
        )
        const schemaSubValue = hasSubDefault
          ? (schemaProperties as any)[key]?.[subKey]
          : null

        const subStatus = calculateSubPropertyStatus(
          key,
          subKey,
          hasSubPropertyOverride(node, key, subKey, workspace),
          hasSubDefault,
          (effective as any)[key],
          schemaSubValue,
          node,
          workspace,
        )

        status[`${key}.${subKey}`] = subStatus
        subStatuses.push(subStatus)
      }

      // Calculate main shorthand property status based on sub-properties
      status[key] = calculateShorthandMainPropertyStatus(subStatuses)
    }
  }

  return status
}

/**
 * Gets the allowed values for a specific property path.
 *
 * This function retrieves the restrictions.allowedValues from the component schema
 * for the given property path. Supports both simple properties and compound sub-properties.
 *
 * @param path - The property path (e.g., "color" or "border.width")
 * @param nodeId - The ID of the node to get allowed values for
 * @param workspace - The workspace containing the node
 * @param _theme - Optional theme (currently unused)
 * @returns Array of allowed values for the property
 *
 * @example
 * ```typescript
 * const allowedColors = getAllowedValues("color", "variant-button-default", workspace)
 * // Returns: ["@swatch.primary", "@swatch.secondary", "#ff0000"]
 *
 * const allowedBorderWidths = getAllowedValues("border.width", "variant-button-default", workspace)
 * // Returns: ["1px", "2px", "4px"]
 * ```
 */
export function getAllowedValues(
  path: string,
  nodeId: string,
  workspace: Workspace,
  _theme?: Theme,
): string[] {
  const node = getTypedNode(nodeId, workspace)
  if (path.includes(".")) {
    const [parentKey, subKey] = path.split(".")
    const schema = getComponentSchema(node.component)
    const parent = (schema as any)?.properties?.[parentKey]
    const sub = parent?.[subKey]
    return sub?.restrictions?.allowedValues ?? []
  }
  const schema = getComponentSchema(node.component)
  const prop = (schema as any)?.properties?.[path]
  return prop?.restrictions?.allowedValues ?? []
}

/**
 * Formats a property value for display in the UI.
 *
 * Converts property values to human-readable strings based on their type:
 * - EXACT values: Shows the actual value (e.g., "16px", "#ff0000")
 * - THEME values: Shows friendly theme names (e.g., "Primary Color")
 * - COMPUTED values: Shows the computed function name (e.g., "Auto Fit")
 * - PRESET values: Shows the preset name
 * - EMPTY values: Shows "Default"
 *
 * @param _path - The property path (currently unused)
 * @param value - The property value to format
 * @param _nodeId - The node ID (currently unused)
 * @param _workspace - The workspace (currently unused)
 * @param theme - Optional theme for resolving theme values
 * @returns Formatted string representation of the value
 *
 * @example
 * ```typescript
 * const formatted = formatValue("color", { type: "exact", value: "#ff0000" }, "node-id", workspace)
 * // Returns: "#ff0000"
 *
 * const themeFormatted = formatValue("color", { type: "theme.categorical", value: "@swatch.primary" }, "node-id", workspace, theme)
 * // Returns: "Primary Color"
 * ```
 */
export function formatValue(
  _path: string,
  value: any,
  _nodeId: string,
  _workspace: Workspace,
  theme?: Theme,
): string {
  if (!value || typeof value !== "object" || !("type" in value))
    return "Default"
  const { type, value: val } = value
  if (type === ValueType.EMPTY) return "Default"
  if (
    type === ValueType.EXACT &&
    val &&
    typeof val === "object" &&
    "unit" in val &&
    "value" in val
  ) {
    return `${val.value}${val.unit}`
  }
  if (
    type === ValueType.EXACT &&
    (typeof val === "string" ||
      typeof val === "number" ||
      typeof val === "boolean")
  ) {
    return String(val)
  }
  if (
    type === ValueType.THEME_CATEGORICAL ||
    type === ValueType.THEME_ORDINAL
  ) {
    const s = String(val)
    if (s.startsWith("@") && theme) {
      // Use the proper friendly name resolution from core
      return getThemeValueName(s, theme)
    }
    if (s.startsWith("@")) {
      const parts = s.split(".")
      if (parts.length >= 2) {
        const token = parts[parts.length - 1]
        return token.charAt(0).toUpperCase() + token.slice(1)
      }
    }
    return s
  }
  if (type === ValueType.PRESET) return String(val)
  if (type === ValueType.COMPUTED) {
    // Show the computed function name instead of just "Computed"
    if (val && typeof val === "object" && "function" in val) {
      const functionName = val.function as ComputedFunction
      return COMPUTED_FUNCTION_DISPLAY_NAMES[functionName] || functionName
    }
    return "Computed"
  }
  return "Has value"
}

/**
 * Formats a compound property for display in the UI.
 *
 * Determines the display text for compound properties based on their current state:
 * - If a preset is matched: Shows the preset name
 * - If custom values are set: Shows "Custom"
 * - If no values are set: Shows "Unset"
 * - If only defaults: Shows "Default"
 *
 * @param propertyKey - The compound property key (e.g., "background", "border")
 * @param nodeId - The ID of the node
 * @param workspace - The workspace containing the node
 * @param theme - Optional theme for preset matching
 * @returns Display string for the compound property
 *
 * @example
 * ```typescript
 * const display = formatCompoundDisplay("background", "variant-button-default", workspace, theme)
 * // Returns: "Primary Background" (if preset matched) or "Custom" (if custom values)
 * ```
 */
export function formatCompoundDisplay(
  propertyKey: string,
  nodeId: string,
  workspace: Workspace,
  theme?: Theme,
): string {
  const effective = getEffectiveProperties(nodeId, workspace)
  const parentProperty = (effective as any)[propertyKey]
  if (!parentProperty || typeof parentProperty !== "object") return "Default"
  const matched = matchCompoundPreset(propertyKey, nodeId, workspace, theme)
  if (matched) return matched
  const siblingKeys = Object.keys(parentProperty).filter((k) => k !== "preset")
  const hasOverridden = siblingKeys.some((k) => {
    const v = parentProperty[k]
    return (
      v && typeof v === "object" && "type" in v && v.type !== ValueType.EMPTY
    )
  })
  if (hasOverridden) return "Custom"
  return "Unset"
}

/**
 * Formats a shorthand property for display in the UI.
 *
 * Creates a display string for shorthand properties by combining all sub-property values.
 * If all sub-properties have the same value, shows that value once.
 * Otherwise, shows all values separated by spaces.
 *
 * @param propertyKey - The shorthand property key (e.g., "margin", "padding")
 * @param nodeId - The ID of the node
 * @param workspace - The workspace containing the node
 * @param theme - Optional theme for value formatting
 * @returns Display string for the shorthand property
 *
 * @example
 * ```typescript
 * const display = formatShorthandDisplay("margin", "variant-button-default", workspace, theme)
 * // Returns: "16px" (if all sides are 16px) or "16px 8px 16px 8px" (if different values)
 * ```
 */
export function formatShorthandDisplay(
  propertyKey: string,
  nodeId: string,
  workspace: Workspace,
  theme?: Theme,
): string {
  const effective = getEffectiveProperties(nodeId, workspace)
  const node = getTypedNode(nodeId, workspace)
  const parent = (effective as any)[propertyKey]
  const subKeys = getSubPropertyKeysFromSchema(propertyKey, node)
  if (!subKeys.length) return "unset"
  const values: string[] = []
  let hasAny = false
  for (const subKey of subKeys) {
    const subVal = parent?.[subKey]
    if (!subVal) {
      values.push("Unset")
      continue
    }
    values.push(
      formatValue(`${propertyKey}.${subKey}`, subVal, nodeId, workspace, theme),
    )
    hasAny = true
  }
  if (!hasAny) return "unset"
  const allSame = values.every((v) => v === values[0])
  return allSame ? values[0] : values.join(" ")
}

/**
 * Expands a shorthand property value into individual sub-properties.
 *
 * Takes a single value and applies it to all sub-properties of a shorthand property
 * (e.g., "margin" expands to "margin.top", "margin.right", "margin.bottom", "margin.left").
 *
 * @param propertyKey - The shorthand property key to expand
 * @param value - The value to apply to all sub-properties
 * @param nodeId - The ID of the node
 * @param workspace - The workspace containing the node
 * @returns Properties object with the expanded shorthand property
 *
 * @example
 * ```typescript
 * const expanded = expandShorthand("margin", { type: "exact", value: "16px" }, "node-id", workspace)
 * // Returns: { margin: { top: { type: "exact", value: "16px" }, right: { type: "exact", value: "16px" }, ... } }
 * ```
 */
export function expandShorthand(
  propertyKey: string,
  value: any,
  nodeId: string,
  workspace: Workspace,
): Properties {
  const node = getTypedNode(nodeId, workspace)
  const subKeys = getSubPropertyKeysFromSchema(propertyKey, node)
  const result: any = {}
  for (const subKey of subKeys) {
    const v =
      value && typeof value === "object" && "type" in value
        ? value
        : { type: ValueType.EXACT, value }
    result[subKey] = v
  }
  return { [propertyKey]: result }
}

/**
 * Applies a compound property preset to a node.
 *
 * Sets all sub-properties of a compound property based on a preset definition from the theme.
 * If the preset is a reset value ("Default", "None", "unset", ""), it resets the property to schema defaults.
 *
 * @param propertyKey - The compound property key to apply the preset to
 * @param preset - The preset name to apply, or a reset value
 * @param nodeId - The ID of the node to apply the preset to
 * @param workspace - The workspace containing the node
 * @param theme - Optional theme containing the preset definitions
 * @returns Properties object with the applied preset values
 *
 * @example
 * ```typescript
 * const applied = applyCompoundPreset("background", "Primary Background", "node-id", workspace, theme)
 * // Returns: { background: { color: { type: "theme.categorical", value: "@swatch.primary" }, ... } }
 *
 * const reset = applyCompoundPreset("background", "Default", "node-id", workspace, theme)
 * // Returns: { background: { color: { type: "empty", value: null }, ... } }
 * ```
 */
export function applyCompoundPreset(
  propertyKey: string,
  preset: string | "Default" | "None" | "unset",
  nodeId: string,
  workspace: Workspace,
  theme?: Theme,
): Properties {
  const node = getTypedNode(nodeId, workspace)
  const schemaProps = getSchemaProperties(node)
  const schemaProp = schemaProps?.[propertyKey as keyof typeof schemaProps]
  const subKeys = getSubPropertyKeysFromSchema(propertyKey, node)

  // Handle reset/unset cases
  if (isResetPreset(preset)) {
    return buildResetProperties(propertyKey, subKeys, schemaProp)
  }

  // Handle theme preset application
  if (!theme) return {}
  const presetObj = findPresetInTheme(theme, propertyKey, preset)
  if (!presetObj) return {}

  return buildPresetProperties(propertyKey, presetObj, subKeys)
}

/**
 * Checks if a preset string represents a reset/unset operation.
 *
 * @param preset - The preset string to check
 * @returns True if the preset is a reset value, false otherwise
 */
function isResetPreset(preset: string): boolean {
  return (
    preset === "Default" ||
    preset === "None" ||
    preset === "unset" ||
    preset === ""
  )
}

/**
 * Builds reset properties for a compound property.
 *
 * Creates a properties object that resets all sub-properties to their schema defaults
 * or empty values if no schema default exists.
 *
 * @param propertyKey - The compound property key
 * @param subKeys - Array of sub-property keys to reset
 * @param schemaProp - The schema property definition
 * @returns Properties object with reset values
 */
function buildResetProperties(
  propertyKey: string,
  subKeys: string[],
  schemaProp: any,
): Properties {
  const EMPTY = { type: ValueType.EMPTY, value: null } as const
  const update: any = { [propertyKey]: {} }

  for (const subKey of subKeys) {
    if (subKey === "preset") continue
    const schemaSub = (schemaProp as any)?.[subKey]
    update[propertyKey][subKey] =
      schemaSub && schemaSub.type !== ValueType.EMPTY ? schemaSub : EMPTY
  }
  return update
}

/**
 * Finds a preset definition in the theme for a specific property.
 *
 * @param theme - The theme to search in
 * @param propertyKey - The property key to find presets for
 * @param preset - The preset name to find
 * @returns The preset object if found, null otherwise
 */
function findPresetInTheme(
  theme: Theme,
  propertyKey: string,
  preset: string,
): any {
  const themeSection = (theme as any)[propertyKey]
  if (!themeSection) return null

  for (const [, presetObj] of Object.entries(themeSection)) {
    if (
      presetObj &&
      typeof presetObj === "object" &&
      "name" in presetObj &&
      (presetObj as any).name === preset
    ) {
      return presetObj
    }
  }
  return null
}

/**
 * Builds properties from a preset object.
 *
 * Converts a preset's parameters into a properties object with proper value types.
 *
 * @param propertyKey - The compound property key
 * @param presetObj - The preset object containing parameters
 * @param subKeys - Array of all sub-property keys for this compound property
 * @returns Properties object with preset values applied
 */
function buildPresetProperties(
  propertyKey: string,
  presetObj: any,
  subKeys: string[],
): Properties {
  const update: any = { [propertyKey]: {} }
  const params = (presetObj as any).parameters

  if (params && typeof params === "object") {
    for (const [subKey, subValue] of Object.entries(params)) {
      update[propertyKey][subKey] = convertPresetValue(subValue)
    }
  }

  // Fill missing subKeys with empty values
  const present = new Set(
    Object.keys(update[propertyKey]).filter((k) => k !== "preset"),
  )
  for (const subKey of subKeys) {
    if (!present.has(subKey)) {
      update[propertyKey][subKey] = { type: ValueType.EMPTY, value: null }
    }
  }

  return update
}

function convertPresetValue(subValue: any): any {
  if (typeof subValue === "string" && subValue.startsWith("@")) {
    return {
      type: ValueType.THEME_CATEGORICAL,
      value: subValue,
    }
  } else if (typeof subValue === "object" && subValue !== null) {
    if ("type" in (subValue as any) && "value" in (subValue as any)) {
      return subValue
    } else {
      return {
        type: ValueType.EXACT,
        value: subValue,
      }
    }
  } else {
    return { type: ValueType.EXACT, value: subValue }
  }
}

/**
 * Matches a compound property's current values against theme presets.
 *
 * Compares the current effective values of a compound property against all available
 * presets in the theme to find a matching preset. Returns the preset name if found.
 *
 * @param propertyKey - The compound property key to match
 * @param nodeId - The ID of the node
 * @param workspace - The workspace containing the node
 * @param theme - Optional theme containing the presets to match against
 * @returns The matching preset name, or null if no match found
 *
 * @example
 * ```typescript
 * const matched = matchCompoundPreset("background", "variant-button-default", workspace, theme)
 * // Returns: "Primary Background" (if current values match this preset) or null
 * ```
 */
export function matchCompoundPreset(
  propertyKey: string,
  nodeId: string,
  workspace: Workspace,
  theme?: Theme,
): string | null {
  if (!theme) return null
  const effective = getEffectiveProperties(nodeId, workspace)
  const parent = (effective as any)[propertyKey]
  const section = (theme as any)[propertyKey]
  if (!section || !parent || typeof parent !== "object") return null
  for (const [, preset] of Object.entries(section)) {
    if (
      preset &&
      typeof preset === "object" &&
      "name" in preset &&
      "parameters" in preset
    ) {
      const params = (preset as any).parameters
      if (params && typeof params === "object") {
        const matches = Object.entries(params).every(([k, v]) => {
          const current = parent[k]
          if (
            current &&
            typeof current === "object" &&
            "type" in current &&
            "value" in current
          ) {
            if (typeof v === "string" && v.startsWith("@"))
              return current.value === v
            if (
              typeof v === "object" &&
              v !== null &&
              "type" in (v as any) &&
              "value" in (v as any)
            )
              return current.value === (v as any).value
            if (typeof v === "object" && v !== null)
              return JSON.stringify(current.value) === JSON.stringify(v)
            return current.value === v
          }
          return false
        })
        if (matches) return (preset as any).name
      }
    }
  }
  return null
}

// ============================================================================
// INTERNAL HELPERS - Core business logic for property processing
// ============================================================================

/** Property status types for UI display */
type PropertyStatus = "set" | "unset" | "override" | "not used"

/**
 * Gets the schema properties for a node.
 *
 * @param node - The node to get schema properties for
 * @returns Schema properties or null if not available
 */
function getSchemaProperties(
  node: Variant | Instance | Board,
): Properties | null {
  // Boards always use the Board schema, regardless of their component field
  const componentId = isBoard(node) ? ComponentId.BOARD : node.component
  const schema = getComponentSchema(componentId)
  if (!schema) return null
  return removeAllowedValuesFromProperties(schema.properties)
}

/**
 * Builds the property inheritance chain for a node.
 *
 * Creates an array of property sources in order of precedence:
 * 1. Node's own properties (highest precedence)
 * 2. Parent instance properties (if applicable)
 * 3. Schema default properties (lowest precedence)
 *
 * @param node - The node to build inheritance chain for
 * @param workspace - The workspace containing the node
 * @param schemaProps - The schema default properties
 * @returns Array of property sources with inheritance metadata
 */
function buildInheritanceChain(
  node: Variant | Instance | Board,
  workspace: Workspace,
  schemaProps: Properties,
): { properties: Properties; isSchema: boolean }[] {
  const chain: { properties: Properties; isSchema: boolean }[] = []
  if (node.properties && Object.keys(node.properties).length > 0) {
    chain.push({ properties: node.properties, isSchema: false })
  }
  // Boards don't have instance inheritance, only variants and instances do
  if ("instanceOf" in node) {
    let current: any = node
    while (current.instanceOf) {
      current = getNodeById(current.instanceOf, workspace)
      if (current.properties && Object.keys(current.properties).length > 0) {
        chain.push({ properties: current.properties, isSchema: false })
      }
    }
  }
  chain.push({ properties: schemaProps, isSchema: true })
  return chain
}

/**
 * Merges the property inheritance chain into final effective properties.
 *
 * Processes the inheritance chain in reverse order (schema first, then overrides)
 * to build the final effective properties with proper precedence.
 *
 * @param chain - The property inheritance chain to merge
 * @returns The merged effective properties
 */
function mergeInheritanceChain(
  chain: { properties: Properties; isSchema: boolean }[],
): Properties {
  let finalProps: Properties = {}
  for (let i = chain.length - 1; i >= 0; i--) {
    const { properties } = chain[i]
    finalProps = mergePropertiesWithoutFiltering(finalProps, properties, {
      mergeSubProperties: true,
    })
  }
  return finalProps
}

/**
 * Merges two property objects without filtering.
 *
 * Combines properties from two objects, with p2 taking precedence over p1.
 * Optionally merges sub-properties for compound properties.
 *
 * @param p1 - First properties object (lower precedence)
 * @param p2 - Second properties object (higher precedence)
 * @param options - Merge options
 * @param options.mergeSubProperties - Whether to merge sub-properties (default: true)
 * @returns The merged properties object
 */
function mergePropertiesWithoutFiltering(
  p1: Properties = {},
  p2: Properties = {},
  options?: { mergeSubProperties?: boolean },
): Properties {
  const keys = Object.keys(p2) as Array<keyof Properties>
  const { mergeSubProperties = true } = options ?? {}
  return keys.reduce((merged, key) => {
    const value =
      key in p1
        ? mergeSubProperties
          ? Object.assign({}, p1[key], p2[key])
          : p2[key]
        : p2[key]
    return { ...merged, [key]: value }
  }, p1)
}

/**
 * Checks if a property key represents a compound property.
 *
 * @param propertyKey - The property key to check
 * @returns True if the property is compound, false otherwise
 */
function isCompoundProperty(propertyKey: string): boolean {
  return getPropertyCategory(propertyKey) === "compound"
}

/**
 * Checks if a property key represents a shorthand property.
 *
 * @param propertyKey - The property key to check
 * @returns True if the property is shorthand, false otherwise
 */
function isShorthandProperty(propertyKey: string): boolean {
  return getPropertyCategory(propertyKey) === "shorthand"
}

/**
 * Checks if a node has overridden a specific sub-property.
 *
 * Traverses the inheritance chain to check if any node in the chain
 * has overridden the specified sub-property.
 *
 * @param node - The node to check
 * @param key - The parent property key
 * @param subKey - The sub-property key
 * @param workspace - The workspace containing the node
 * @returns True if the sub-property is overridden, false otherwise
 */
function hasSubPropertyOverride(
  node: Variant | Instance | Board,
  key: string,
  subKey: string,
  workspace: Workspace,
): boolean {
  if (
    node.properties &&
    key in node.properties &&
    (node.properties as any)[key] &&
    typeof (node.properties as any)[key] === "object" &&
    subKey in (node.properties as any)[key]
  ) {
    return true
  }
  // Boards don't have instance inheritance, only variants and instances do
  if ("instanceOf" in node) {
    let current: any = node
    while (current.instanceOf) {
      current = getNodeById(current.instanceOf, workspace)
      if (
        current.properties &&
        key in current.properties &&
        (current.properties as any)[key] &&
        typeof (current.properties as any)[key] === "object" &&
        subKey in (current.properties as any)[key]
      ) {
        return true
      }
    }
  }
  return false
}

/**
 * Checks if a compound property has any non-empty sub-properties.
 *
 * @param propertyValue - The compound property value to check
 * @returns True if any sub-property is set (not empty), false otherwise
 */
function hasNonEmptySubProperties(propertyValue: any): boolean {
  if (!propertyValue || typeof propertyValue !== "object") return false
  return Object.keys(propertyValue)
    .filter((k) => k !== "preset")
    .some((k) => {
      const val = propertyValue[k]
      return isValueSet(val)
    })
}

/**
 * Compares two property values for equality using the same logic as matchCompoundPreset.
 *
 * Handles various value types including theme values, object values, and direct comparisons.
 * Used for determining if a node value matches a schema default value.
 *
 * @param nodeValue - The node's property value
 * @param schemaValue - The schema's default value
 * @returns True if the values are equal, false otherwise
 */
function areValuesEqual(nodeValue: any, schemaValue: any): boolean {
  if (!nodeValue || !schemaValue) return false

  // Handle property objects that have { type, value } structure
  if (
    typeof nodeValue === "object" &&
    nodeValue !== null &&
    "type" in nodeValue &&
    "value" in nodeValue &&
    typeof schemaValue === "object" &&
    schemaValue !== null &&
    "type" in schemaValue &&
    "value" in schemaValue
  ) {
    // Direct value comparison for theme values
    if (
      typeof schemaValue.value === "string" &&
      schemaValue.value.startsWith("@")
    ) {
      return nodeValue.value === schemaValue.value
    }

    // Object value comparison
    if (
      typeof schemaValue.value === "object" &&
      schemaValue.value !== null &&
      "type" in schemaValue.value &&
      "value" in schemaValue.value
    ) {
      return nodeValue.value === schemaValue.value.value
    }

    // JSON comparison for complex objects
    if (typeof schemaValue.value === "object" && schemaValue.value !== null) {
      return (
        JSON.stringify(nodeValue.value) === JSON.stringify(schemaValue.value)
      )
    }

    // Direct value comparison
    return nodeValue.value === schemaValue.value
  }

  return false
}

/**
 * Calculates the status of a property based on its current state and schema defaults.
 *
 * Determines whether a property is "set", "unset", "override", or "not used" based on:
 * - Whether the node has overridden the property
 * - Whether the schema has a default value
 * - Whether the node value matches the schema default
 *
 * @param key - The property key
 * @param hasNodeOverride - Whether the node has overridden this property
 * @param hasSchemaDefault - Whether the schema has a default for this property
 * @param nodePropertyValue - The node's property value
 * @param schemaValue - The schema's default value
 * @param node - The node being evaluated
 * @param workspace - The workspace containing the node
 * @returns The calculated property status
 */
function calculatePropertyStatus(
  key: string,
  hasNodeOverride: boolean,
  hasSchemaDefault: boolean,
  nodePropertyValue: any,
  schemaValue: any,
  node: Variant | Instance | Board,
  workspace: Workspace,
): PropertyStatus {
  if (hasNodeOverride) {
    if (isCompoundProperty(key)) {
      return hasOverriddenSiblingProperties(node, key, workspace)
        ? "override"
        : hasNonEmptySubProperties(nodePropertyValue)
          ? "set"
          : "unset"
    }

    // For atomic properties, check if the node value matches the schema value
    if (hasSchemaDefault && schemaValue) {
      if (areValuesEqual(nodePropertyValue, schemaValue)) {
        return "set" // Schema-matched value should be "set", not "override"
      }
    }

    return "override"
  }
  if (hasSchemaDefault) {
    return isValueEmpty(schemaValue) ? "unset" : "set"
  }
  return "not used"
}

/**
 * Checks if a compound property has any overridden sibling properties.
 *
 * @param node - The node to check
 * @param key - The compound property key
 * @param workspace - The workspace containing the node
 * @returns True if any sibling properties are overridden, false otherwise
 */
function hasOverriddenSiblingProperties(
  node: Variant | Instance | Board,
  key: string,
  workspace: Workspace,
): boolean {
  if (!node.properties || !(key in node.properties)) return false
  const propertyValue = (node.properties as any)[key]
  if (!propertyValue || typeof propertyValue !== "object") return false
  return Object.keys(propertyValue)
    .filter((k) => k !== "preset")
    .some((k) => hasSubPropertyOverride(node, key, k, workspace))
}

/**
 * Calculates the status of a sub-property within a compound property.
 *
 * Similar to calculatePropertyStatus but handles sub-properties within compound properties.
 *
 * @param key - The parent property key
 * @param subKey - The sub-property key
 * @param hasSubOverride - Whether the sub-property is overridden
 * @param hasSubDefault - Whether the schema has a default for this sub-property
 * @param parentProperty - The parent compound property value
 * @param schemaSubValue - The schema's default value for this sub-property
 * @param _node - The node being evaluated (unused)
 * @param _workspace - The workspace (unused)
 * @returns The calculated sub-property status
 */
function calculateSubPropertyStatus(
  key: string,
  subKey: string,
  hasSubOverride: boolean,
  hasSubDefault: boolean,
  parentProperty: any,
  schemaSubValue: any,
  _node: Variant | Instance | Board,
  _workspace: Workspace,
): PropertyStatus {
  if (hasSubOverride) {
    if (isCompoundProperty(key)) {
      if (subKey === "preset") {
        // Check if the node value matches the schema value
        if (hasSubDefault && schemaSubValue) {
          const subValue = parentProperty?.[subKey]
          if (areValuesEqual(subValue, schemaSubValue)) {
            return "set" // Schema-matched value should be "set", not "override"
          }
        }
        return "override"
      }
      const subValue = parentProperty?.[subKey]
      return isValueEmpty(subValue) ? "unset" : "override"
    }
    return "override"
  }
  if (isCompoundProperty(key) && subKey === "preset") {
    const siblingKeys = Object.keys(parentProperty || {}).filter(
      (k) => k !== "preset",
    )
    const allSiblingsUnset = siblingKeys.every((siblingKey) => {
      const siblingValue = parentProperty?.[siblingKey]
      return isValueEmpty(siblingValue)
    })
    if (allSiblingsUnset) return "unset"
    return hasNonEmptySubProperties(parentProperty) ? "override" : "set"
  }
  if (hasSubDefault) return isValueEmpty(schemaSubValue) ? "unset" : "set"
  return "not used"
}

/**
 * Calculates the status of a main shorthand property based on its sub-properties.
 *
 * The main shorthand property status is determined by the status of its sub-properties:
 * - If all sub-properties are "unset" → main property is "unset"
 * - If any sub-properties are "override" → main property is "override"
 * - If any sub-properties are "set" → main property is "set"
 * - If any sub-properties are "not used" → main property is "not used"
 *
 * @param subStatuses - Array of status values for all sub-properties
 * @returns The calculated status for the main shorthand property
 */
function calculateShorthandMainPropertyStatus(
  subStatuses: PropertyStatus[],
): PropertyStatus {
  if (subStatuses.length === 0) {
    return "not used"
  }

  // Priority order: "not used" > "override" > "set" > "unset"
  if (subStatuses.includes("not used")) {
    return "not used"
  }

  if (subStatuses.includes("override")) {
    return "override"
  }

  if (subStatuses.includes("set")) {
    return "set"
  }

  // If all sub-properties are "unset", the main property is also "unset"
  return "unset"
}

/**
 * Gets the structure of a compound property by combining actual and schema keys.
 *
 * @param propertyKey - The compound property key
 * @param propertyValue - The current property value
 * @param node - The node containing the property
 * @returns Array of all sub-property keys for this compound property
 */
function getCompoundPropertyStructure(
  propertyKey: string,
  propertyValue: any,
  node: Variant | Instance | Board,
): string[] {
  const actualKeys = getSubPropertyKeysFromObject(propertyValue)
  const schemaKeys = getSubPropertyKeysFromSchema(propertyKey, node)
  return [...new Set([...actualKeys, ...schemaKeys])]
}

/**
 * Gets sub-property keys from an object.
 *
 * @param obj - The object to extract keys from
 * @returns Array of object keys, or empty array if not an object
 */
function getSubPropertyKeysFromObject(obj: any): string[] {
  if (!obj || typeof obj !== "object") return []
  return Object.keys(obj)
}

/**
 * Gets sub-property keys from the schema for a given property.
 *
 * @param propertyKey - The property key to get schema keys for
 * @param node - The node to get schema from
 * @returns Array of schema-defined sub-property keys
 */
function getSubPropertyKeysFromSchema(
  propertyKey: string,
  node: Variant | Instance | Board,
): string[] {
  // Boards always use the Board schema, regardless of their component field
  const componentId = isBoard(node) ? ComponentId.BOARD : node.component
  const schema = getComponentSchema(componentId)
  const schemaProp = (schema?.properties as any)?.[propertyKey]
  return schemaProp && typeof schemaProp === "object"
    ? Object.keys(schemaProp)
    : []
}
