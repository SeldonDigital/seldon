import { Properties, PropertyKey, Theme, ValueType } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId, isComponentId } from "@seldon/core/components/constants"
import { formatPresetValue } from "@seldon/core/helpers/properties/format-preset-value"
import { isCompoundProperty } from "@seldon/core/helpers/type-guards/compound/is-compound-property"
import { getThemeValueName } from "@seldon/core/helpers/theme/get-theme-value-name"
import { isIconSetVariant } from "@seldon/core/icons/helpers/is-icon-set-variant"
import {
  applyBoardDevicePreset,
  buildBoardCompoundReset,
  matchBoardCompoundPreset,
  resolveBoardPresetIdFromPickerValue,
  type BoardCompound,
} from "../../../properties/values/layout/board"
import { COMPUTED_FUNCTION_DISPLAY_NAMES } from "@seldon/core/properties/compute"
import { getPropertyCategory } from "@seldon/core/properties/schemas"
import {
  getCatalogKeyForPropertyPath,
  getPropertyOptions,
  getPropertySchema,
} from "@seldon/core/properties/schemas/helpers"
import type { PropertyValueType } from "@seldon/core/properties/types/schema"
import {
  getEffectiveNodeProperties,
  type WorkspacePropertySource,
} from "@seldon/core/workspace/compute"
import { getComponentPropertyDefaults } from "@seldon/core/workspace/helpers/components/get-component-property-defaults"
import { isComponentEntry } from "@seldon/core/workspace/helpers/components/is-component-entry"
import { getNodeById } from "@seldon/core/workspace/helpers/nodes/get-node-by-id"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import type { ComponentEntry, EntryNode, Workspace } from "@seldon/core/workspace/types"
import {
  isLayeredPaintProperty,
  type PropertyKey as CorePropertyKey,
} from "@seldon/core/properties/types/property-keys"

type PropertyPanelSubject = ComponentEntry | EntryNode

const LAYERED_PAINT_LAYER_INDEX = 0

function compoundSubPropertyPath(propertyKey: string, subKey: string): string {
  if (isLayeredPaintProperty(propertyKey as CorePropertyKey)) {
    return `${propertyKey}.${LAYERED_PAINT_LAYER_INDEX}.${subKey}`
  }
  return `${propertyKey}.${subKey}`
}

function getCompoundLayerValue(
  value: unknown,
): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null
  if (Array.isArray(value)) {
    const layer = value[LAYERED_PAINT_LAYER_INDEX]
    if (!layer || typeof layer !== "object" || Array.isArray(layer)) {
      return null
    }
    return layer as Record<string, unknown>
  }
  return value as Record<string, unknown>
}

function wrapCompoundPropertyValue(
  propertyKey: string,
  facets: Record<string, unknown>,
): Properties {
  if (isLayeredPaintProperty(propertyKey as CorePropertyKey)) {
    return { [propertyKey]: [facets] } as Properties
  }
  return { [propertyKey]: facets } as Properties
}

/**
 * Helpers for the editor properties panel: effective properties, status,
 * allowed values, formatting, and compound preset handling.
 */

// ============================================================================
// TYPED HELPERS - Extract common patterns to reduce duplication
// ============================================================================

function getPropertyOverridesBag(
  subject: PropertyPanelSubject,
): Properties | undefined {
  if (isComponentEntry(subject)) {
    return subject.componentProperties
  }
  return subject.overrides
}

function resolveComponentId(
  subject: PropertyPanelSubject,
  workspace: Workspace,
): ComponentId | undefined {
  if (isComponentEntry(subject)) {
    if (subject.type === "component" && isComponentId(subject.catalogId)) {
      return subject.catalogId
    }
    return undefined
  }
  const catalogId = getNodeCatalogId(subject, workspace)
  if (catalogId && isComponentId(catalogId)) {
    return catalogId
  }
  return undefined
}

function getTypedNode(
  nodeId: string,
  workspace: Workspace,
): PropertyPanelSubject {
  const catalogRow = workspace.components[nodeId]
  if (catalogRow) {
    return catalogRow
  }
  return getNodeById(nodeId, workspace)
}

/**
 * Gets a specific property from the node's schema properties.
 *
 * @param node - The node to get schema properties from
 * @param propertyKey - The property key to retrieve
 * @returns The schema property value or undefined
 */
function getSchemaProperty(
  node: PropertyPanelSubject,
  propertyKey: string,
  workspace?: Workspace,
) {
  const schemaProperties = getSchemaProperties(node, workspace)
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
  node: PropertyPanelSubject,
  key: string,
  subKey?: string,
): boolean {
  const bag = getPropertyOverridesBag(node)
  if (!bag || !(key in bag)) return false

  const propertyValue = (bag as Record<string, unknown>)[key]
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
  const layer = getCompoundLayerValue(
    (schemaProperties as Record<string, unknown> | null)?.[key],
  )
  return !!(layer && subKey in layer)
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
  return getEffectiveNodeProperties(nodeId, workspace as WorkspacePropertySource)
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
  const schemaProperties = getSchemaProperties(node, workspace)
  const status: Record<string, "set" | "unset" | "override" | "not used"> = {}
  if (!schemaProperties) return status

  const effective = getEffectiveProperties(nodeId, workspace)

  for (const key of Object.keys(effective)) {
    const hasNodeOverride = hasPropertyOverride(node, key)
    const hasSchemaDefault = key in schemaProperties
    const bag = getPropertyOverridesBag(node)
    const nodeValue = hasNodeOverride ? (bag as any)?.[key] : null
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
      const compoundLayer = getCompoundLayerValue(compoundValue)
      if (compoundLayer) {
        const subKeys = getCompoundPropertyStructure(
          key,
          compoundValue,
          node,
          workspace,
        )
        const schemaLayer = getCompoundLayerValue(
          (schemaProperties as Record<string, unknown> | null)?.[key],
        )
        for (const subKey of subKeys) {
          const hasSubDefault = hasSchemaSubProperty(
            schemaProperties,
            key,
            subKey,
          )
          const schemaSubValue = hasSubDefault
            ? schemaLayer?.[subKey]
            : null

          status[compoundSubPropertyPath(key, subKey)] =
            calculateSubPropertyStatus(
              key,
              subKey,
              hasSubPropertyOverride(node, key, subKey, workspace),
              hasSubDefault,
              compoundLayer,
              schemaSubValue,
              node,
              workspace,
            )
        }
      }
    }

    // Handle shorthand properties
    if (isShorthandProperty(key as PropertyKey)) {
      const subKeys = getSubPropertyKeysFromSchema(key, node, workspace)
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

const PICKER_VALUE_TYPES: readonly PropertyValueType[] = [
  "option",
  "themeCategorical",
  "themeOrdinal",
]

function pickerEntryToString(entry: unknown): string {
  if (
    typeof entry === "object" &&
    entry !== null &&
    "value" in entry &&
    (entry as { value: unknown }).value !== undefined
  ) {
    return String((entry as { value: unknown }).value)
  }
  return String(entry)
}

/**
 * Returns picker values for a property path from the property schema catalog.
 * Returns bare option keys for theme tokens (e.g. `primary`), not stored `@swatch.*` paths.
 * Editor menus use `getPropertyPickerOptions` instead.
 *
 * @param path - Property path such as `color` or `border.width`
 * @param _nodeId - Reserved for future workspace-specific option lists
 * @param workspace - Forwarded to schemas that build options from workspace data
 * @param theme - Required for theme categorical and ordinal pickers
 */
export function getAllowedValues(
  path: string,
  _nodeId: string,
  workspace: Workspace,
  theme?: Theme,
): string[] {
  const catalogKey = getCatalogKeyForPropertyPath(path)
  if (!catalogKey) return []

  const schema = getPropertySchema(catalogKey)
  if (!schema) return []

  const values = new Set<string>()
  for (const valueType of schema.supports) {
    if (!PICKER_VALUE_TYPES.includes(valueType)) continue
    if (
      (valueType === "themeCategorical" || valueType === "themeOrdinal") &&
      !theme
    ) {
      continue
    }
    for (const entry of getPropertyOptions(
      catalogKey,
      valueType,
      theme,
      workspace,
    )) {
      values.add(pickerEntryToString(entry))
    }
  }

  return [...values]
}

/**
 * Formats a property value for display in the UI.
 *
 * Converts property values to human-readable strings based on their type:
 * - EXACT values: Shows the actual value (e.g., "16px", "#ff0000")
 * - THEME values: Shows friendly theme names (e.g., "Primary Color")
 * - COMPUTED values: Shows the computed function name (e.g., "Auto Fit")
 * - OPTION values: Shows the option label / preset name
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
    // Format boolean values as "On"/"Off" for consistency with stringifyValue
    if (typeof val === "boolean") {
      return val ? "On" : "Off"
    }
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
  if (type === ValueType.OPTION) {
    return formatPresetValue(String(val))
  }
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
  const parentLayer = getCompoundLayerValue((effective as any)[propertyKey])
  if (!parentLayer) return "Default"
  const matched = matchCompoundPreset(propertyKey, nodeId, workspace, theme)
  if (matched) return matched
  const siblingKeys = Object.keys(parentLayer).filter((k) => k !== "preset")
  const hasOverridden = siblingKeys.some((k) => {
    const v = parentLayer[k]
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
  const subKeys = getSubPropertyKeysFromSchema(propertyKey, node, workspace)
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
  const subKeys = getSubPropertyKeysFromSchema(propertyKey, node, workspace)
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
  const schemaProps = getSchemaProperties(node, workspace)
  const schemaProp = schemaProps?.[propertyKey as keyof typeof schemaProps]
  const subKeys = getSubPropertyKeysFromSchema(propertyKey, node, workspace)

  // Handle reset/unset cases
  if (isResetPreset(preset)) {
    if (propertyKey === "board") {
      const schemaBoard = getCompoundLayerValue(schemaProp) as
        | BoardCompound
        | undefined
      return buildBoardCompoundReset(schemaBoard)
    }
    return buildResetProperties(propertyKey, subKeys, schemaProp)
  }

  if (propertyKey === "board") {
    const presetId = resolveBoardPresetIdFromPickerValue(preset)
    if (presetId) {
      return { board: applyBoardDevicePreset(presetId) }
    }
    return {}
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
  const schemaLayer = getCompoundLayerValue(schemaProp) ?? {}
  const facets: Record<string, unknown> = {}

  for (const subKey of subKeys) {
    if (subKey === "preset") continue
    const schemaSub = schemaLayer[subKey]
    facets[subKey] =
      schemaSub &&
      typeof schemaSub === "object" &&
      "type" in schemaSub &&
      schemaSub.type !== ValueType.EMPTY
        ? schemaSub
        : EMPTY
  }
  return wrapCompoundPropertyValue(propertyKey, facets)
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
  const facets: Record<string, unknown> = {}
  const params = (presetObj as any).parameters

  if (params && typeof params === "object") {
    for (const [subKey, subValue] of Object.entries(params)) {
      facets[subKey] = convertPresetValue(subValue)
    }
  }

  const present = new Set(Object.keys(facets).filter((k) => k !== "preset"))
  for (const subKey of subKeys) {
    if (!present.has(subKey)) {
      facets[subKey] = { type: ValueType.EMPTY, value: null }
    }
  }

  return wrapCompoundPropertyValue(propertyKey, facets)
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
  if (propertyKey === "board") {
    const effective = getEffectiveProperties(nodeId, workspace)
    const parent = getCompoundLayerValue(
      (effective as Record<string, unknown>).board,
    ) as BoardCompound | undefined
    return matchBoardCompoundPreset(parent)
  }

  if (!theme) return null
  const effective = getEffectiveProperties(nodeId, workspace)
  const parent = getCompoundLayerValue((effective as any)[propertyKey])
  const section = (theme as any)[propertyKey]
  if (!section || !parent) return null
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
  node: PropertyPanelSubject,
  workspace?: Workspace,
): Properties | null {
  if (isComponentEntry(node)) {
    return getComponentPropertyDefaults()
  }

  if (workspace && isIconSetVariant(node, workspace)) {
    const iconSchema = getComponentSchema(ComponentId.ICON)
    if (!iconSchema) return null
    return iconSchema.properties
  }

  if (!workspace?.nodes) return null

  const componentId = resolveComponentId(node, workspace)
  if (!componentId) return null
  const schema = getComponentSchema(componentId)
  if (!schema) return null
  return schema.properties
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
  node: PropertyPanelSubject,
  key: string,
  subKey: string,
  _workspace: Workspace,
): boolean {
  const bag = getPropertyOverridesBag(node)
  if (!bag || !(key in bag)) return false
  const layer = getCompoundLayerValue((bag as Record<string, unknown>)[key])
  return !!(layer && subKey in layer)
}

/**
 * Checks if a compound property has any non-empty sub-properties.
 *
 * @param propertyValue - The compound property value to check
 * @returns True if any sub-property is set (not empty), false otherwise
 */
function hasNonEmptySubProperties(propertyValue: any): boolean {
  const layer = getCompoundLayerValue(propertyValue)
  if (!layer) return false
  return Object.keys(layer)
    .filter((k) => k !== "preset")
    .some((k) => {
      const val = layer[k]
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
  node: PropertyPanelSubject,
  workspace: Workspace,
): PropertyStatus {
  if (hasNodeOverride) {
    if (isCompoundProperty(key as PropertyKey)) {
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
  node: PropertyPanelSubject,
  key: string,
  workspace: Workspace,
): boolean {
  const bag = getPropertyOverridesBag(node)
  if (!bag || !(key in bag)) return false
  const propertyValue = (bag as Record<string, unknown>)[key]
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
  _node: PropertyPanelSubject,
  _workspace: Workspace,
): PropertyStatus {
  if (hasSubOverride) {
    if (isCompoundProperty(key as PropertyKey)) {
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
  if (isCompoundProperty(key as PropertyKey) && subKey === "preset") {
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
export function getCompoundPropertyStructure(
  propertyKey: string,
  propertyValue: any,
  node: PropertyPanelSubject,
  workspace: Workspace,
): string[] {
  const actualKeys = getSubPropertyKeysFromObject(propertyValue)
  const schemaKeys = getSubPropertyKeysFromSchema(propertyKey, node, workspace)
  return [...new Set([...actualKeys, ...schemaKeys])]
}

/**
 * Gets sub-property keys from an object.
 *
 * @param obj - The object to extract keys from
 * @returns Array of object keys, or empty array if not an object
 */
function getSubPropertyKeysFromObject(obj: any): string[] {
  const layer = getCompoundLayerValue(obj)
  if (!layer) return []
  return Object.keys(layer)
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
  node: PropertyPanelSubject,
  workspace: Workspace,
): string[] {
  const schemaProps = getSchemaProperties(node, workspace)
  const schemaProp = (schemaProps as Record<string, unknown> | null)?.[propertyKey]
  const layer = getCompoundLayerValue(schemaProp)
  return layer ? Object.keys(layer) : []
}
