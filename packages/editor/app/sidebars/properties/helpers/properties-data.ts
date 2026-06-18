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
  getCompoundLayerValue,
  isLayeredPaintRoot,
  layeredFacetPath,
  layeredParentPath,
} from "@lib/properties/property-paths"
import {
  BORDER_SIDE_KEYS,
  Board,
  BorderSideKey,
  Instance,
  Properties,
  PropertyKey,
  Theme,
  ValueType,
  Variant,
  Workspace,
  getCompoundSelectorFacet,
} from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { isComponentId } from "@seldon/core/components/constants"
import { findInObject } from "@seldon/core/helpers"
import {
  formatCompoundDisplay as coreFormatCompoundDisplay,
  formatShorthandDisplay as coreFormatShorthandDisplay,
  formatValue as coreFormatValue,
  getEffectiveProperties as coreGetEffectiveProperties,
  getPropertyStatus as coreGetPropertyStatus,
  getCompoundPropertyStructure,
} from "@seldon/core/helpers/properties/properties-bridge"
import {
  getCompoundSubPropertySchema,
  getPropertyCategory,
} from "@seldon/core/properties/schemas"
import {
  getCatalogKeyForPropertyPath,
  getInspectorRootPropertyKeys,
  getPropertySchema,
  validatePropertyValue,
} from "@seldon/core/properties/schemas/helpers"
import { getPresetOptions } from "@seldon/core/properties/schemas/helpers/property-options"
import { isLayeredPaintProperty } from "@seldon/core/properties/types/property-keys"
import type {
  PropertyKey as CorePropertyKey,
  LayeredPaintKey,
} from "@seldon/core/properties/types/property-keys"
import { getComponentPropertyDefaults } from "@seldon/core/workspace/helpers/components/get-component-property-defaults"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { isPlaygroundBoard } from "@seldon/core/workspace/model/components"
import { getNodeCatalogComponentId } from "@lib/workspace/node-tree"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
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
  /** Theme look parent row: groups facet sub-rows under a disclosure arrow only. */
  isLookParent?: boolean
  pickerVariant?: "themeAssignment"
  isDimmed?: boolean
  status: PropertyStatus
  /** Theme color-point rows set this for swatch icon preview in the properties tree. */
  iconColorValue?: string
  /** Menu/combo options supplied directly, for rows not backed by the property schema. */
  options?: Array<{ name: string; value: string }>
  /** When set, the value cell renders as a link to this URL (read-only rows). */
  linkHref?: string
  /**
   * Paint-layer slot for a layered paint parent row (`background`/`gradient`/
   * `shadow`). Lets the picker and commit target the right layer while leaving
   * the others intact. Absent on non-layered and facet rows.
   */
  layerIndex?: number
}

/**
 * Checks if a compound property has preset options available in the theme
 * @param propertyKey - The compound property key (e.g., "background", "border")
 * @param theme - Optional theme to check for preset options
 * @returns True if the theme has a section for this property with preset options
 */
/**
 * Whether a compound's parent row renders a selector combo. Compounds whose
 * core selector facet is `kind` (background) always do; other compounds only
 * when the theme offers presets.
 */
export function hasCompoundSelectorCombo(
  propertyKey: string,
  theme?: Theme,
  workspace?: Workspace,
): boolean {
  if (!isCompoundProperty(propertyKey)) {
    return false
  }
  if (getCompoundSelectorFacet(propertyKey) === "kind") {
    return true
  }
  return hasCompoundPresetOptions(propertyKey, theme, workspace)
}

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

  // Check if theme has a section for this property (e.g., theme.border)
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

function subPropertyPathFor(
  parentKey: string,
  subKey: string,
  layerIndex: number = 0,
): string {
  if (isLayeredPaintRoot(parentKey)) {
    return layeredFacetPath(parentKey as LayeredPaintKey, subKey, layerIndex)
  }
  return `${parentKey}.${subKey}`
}

export function getPropertiesSubjectId(
  node: Variant | Instance | Board,
): string {
  if (isBoard(node)) return getComponentKey(node)
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

function isInvalidExactStringValue(
  propertyPath: string,
  value: unknown,
  controlType: ControlType | undefined,
  theme?: Theme,
): boolean {
  if (
    !value ||
    typeof value !== "object" ||
    !("type" in value) ||
    (value as { type: ValueType }).type !== ValueType.EXACT ||
    !("value" in value) ||
    typeof (value as { value: unknown }).value !== "string"
  ) {
    return false
  }

  const basePropertyName = propertyPath.includes(".")
    ? propertyPath.split(".").pop()
    : propertyPath

  const isComboControl = controlType === "combo"
  const isImageProperty =
    basePropertyName === "source" || basePropertyName === "image"
  const isBackgroundImageProperty =
    basePropertyName === "image" && propertyPath.startsWith("background")

  if (
    isComboControl ||
    isImageProperty ||
    isBackgroundImageProperty ||
    !basePropertyName
  ) {
    return false
  }

  return !validatePropertyValue(
    basePropertyName,
    "exact",
    (value as Record<string, unknown>).value as string,
    theme,
  )
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

  if (
    !hasError &&
    isInvalidExactStringValue(
      propertyKey,
      propertyValue,
      registryEntry?.control,
      theme,
    )
  ) {
    hasError = true
    actualValue = (propertyValue as Record<string, unknown>).value as string
  }

  // Determine final status
  let finalStatus: PropertyStatus = status
  if (hasError) {
    finalStatus = "error"
  }

  const usesCompoundPresetPicker =
    isCompound && hasCompoundSelectorCombo(propertyKey, theme, workspace)

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
    icon: registryEntry?.icon || "seldon-token",
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
  layerIndex: number = 0,
): FlatProperty {
  const subPropertyPath = subPropertyPathFor(propertyKey, subKey, layerIndex)
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
    icon: subRegistryEntry?.icon || "seldon-token",
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

      if (
        !hasError &&
        isInvalidExactStringValue(
          subPropertyPath,
          subValue,
          subRegistryEntry?.control,
          theme,
        )
      ) {
        hasError = true
        actualValue = (subValue as Record<string, unknown>).value as string
      }

      return actualValue
    })(),
    valueType: getValueType(subValue),
    controlType: subRegistryEntry?.control,
    isCompound: false,
    isShorthand: false,
    isSubProperty: true,
    isDimmed: !!isDimmed,
    status: isInvalidExactStringValue(
      subPropertyPath,
      subValue,
      subRegistryEntry?.control,
      theme,
    )
      ? "error"
      : status,
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
  layerIndex: number = 0,
  rawLayerArray?: unknown,
): FlatProperty[] {
  const subProperties: FlatProperty[] = []

  // For an explicit upper paint layer, read facets from the raw stack at its
  // index. Otherwise keep the index-0 / non-layered resolution unchanged.
  const compoundValue =
    rawLayerArray !== undefined
      ? rawLayerArray
      : mergedProperties !== undefined
        ? (resolvePropertyValueForDisplay(mergedProperties, propertyKey) ??
          propertyValue)
        : propertyValue

  const layer = getCompoundLayerValue(compoundValue, layerIndex)

  const subPropertyKeys = filterCompoundPropertyKeys(
    getCompoundPropertyStructure(
      propertyKey,
      layer ?? compoundValue,
      node,
      workspace,
    ),
    propertyKey,
  )

  // The compound's selector facet (`preset` or `kind`) is shown on the parent
  // row's combo, so filter it out of the child facet list to avoid a duplicate.
  const hasSelectorCombo = hasCompoundSelectorCombo(
    propertyKey,
    theme,
    workspace,
  )
  const selectorFacet = getCompoundSelectorFacet(propertyKey)

  for (const subKey of subPropertyKeys) {
    if (subKey === selectorFacet && hasSelectorCombo) {
      continue
    }

    const subValue = layer?.[subKey]
    const subPropertyPath = subPropertyPathFor(propertyKey, subKey, layerIndex)
    // Core emits status for every paint layer keyed `root.index.facet`, so the
    // editor reads it directly instead of fabricating a status for upper layers.
    const status = propertyStatus[subPropertyPath] ?? "not used"

    const flatSubProperty = createFlatSubProperty(
      propertyKey,
      subKey,
      subValue,
      status,
      node,
      workspace,
      theme,
      layerIndex,
    )

    subProperties.push(flatSubProperty)
  }

  return subProperties
}

/**
 * Builds the parent row for an upper paint layer (index >= 1). It mirrors the
 * index-0 compound row: a preset combo (when the property has theme presets)
 * plus expandable facet children. `layerIndex` lets the commit target this slot
 * and leave the other layers intact.
 */
function buildLayerParentFlatProperty(
  propertyKey: LayeredPaintKey,
  index: number,
  label: string,
  layerValue: unknown,
  node: Variant | Instance | Board,
  workspace: Workspace,
  propertyStatus: Record<string, PropertyStatus>,
  theme?: Theme,
): FlatProperty {
  const registryEntry = getPropertyRegistryEntry(propertyKey)
  const usesPresetPicker = hasCompoundSelectorCombo(
    propertyKey,
    theme,
    workspace,
  )

  // Core resolves the compound display per layer (preset name / "Custom" /
  // "None"), the same path the index-0 row uses, so upper layers stay 1:1.
  let actualValue = ""
  try {
    actualValue = coreFormatCompoundDisplay(
      propertyKey,
      getPropertiesSubjectId(node),
      workspace,
      theme,
      index,
    )
  } catch {
    actualValue = ""
  }

  const parentStatus =
    propertyStatus[layeredParentPath(propertyKey, index)] ?? "unset"

  return {
    key: layeredParentPath(propertyKey, index),
    label,
    value: layerValue || EMPTY_VALUE,
    actualValue,
    valueType: getValueType(layerValue),
    controlType: usesPresetPicker ? "combo" : registryEntry?.control,
    isCompound: true,
    isShorthand: false,
    isSubProperty: false,
    propertyType: "compound",
    status: parentStatus,
    icon: registryEntry?.icon || "seldon-token",
    layerIndex: index,
  }
}

/**
 * Emits one parent row plus facet children for every paint layer of a layered
 * property. Rows come out in reverse index order, so the highest index renders
 * at the top and index 0 (the bottom layer) renders last. Labels are positional
 * when more than one layer exists.
 */
function flattenLayeredPaintProperty(
  propertyKey: LayeredPaintKey,
  mergedProperties: Properties,
  propertyStatus: Record<string, PropertyStatus>,
  node: Variant | Instance | Board,
  workspace: Workspace,
  theme?: Theme,
): FlatProperty[] {
  const out: FlatProperty[] = []
  const rawArray = mergedProperties[propertyKey as keyof Properties]
  const layerCount = Array.isArray(rawArray)
    ? rawArray.length
    : rawArray
      ? 1
      : 0
  const count = Math.max(layerCount, 1)
  const baseLabel =
    getPropertyRegistryEntry(propertyKey)?.label ||
    formatPropertyLabel(propertyKey)

  for (let i = count - 1; i >= 0; i--) {
    if (i === 0) {
      const layer0 = getCompoundLayerValue(rawArray, 0) || EMPTY_VALUE
      const status = propertyStatus[propertyKey] || "unset"
      const parent = createFlatProperty(
        propertyKey,
        layer0,
        status,
        node,
        workspace,
        theme,
      )
      parent.layerIndex = 0
      if (count > 1) {
        parent.label = `${baseLabel} 1`
      }
      out.push(parent)
      out.push(
        ...getSubProperties(
          propertyKey,
          layer0,
          workspace,
          node,
          propertyStatus,
          theme,
          mergedProperties,
        ),
      )
    } else {
      const layerValue = getCompoundLayerValue(rawArray, i) || EMPTY_VALUE
      out.push(
        buildLayerParentFlatProperty(
          propertyKey,
          i,
          `${baseLabel} ${i + 1}`,
          layerValue,
          node,
          workspace,
          propertyStatus,
          theme,
        ),
      )
      out.push(
        ...getSubProperties(
          propertyKey,
          EMPTY_VALUE,
          workspace,
          node,
          propertyStatus,
          theme,
          undefined,
          i,
          rawArray,
        ),
      )
    }
  }

  return out
}

/**
 * The border sides this subject's schema exposes. Only these can be shown; the
 * menu dims the rest. Boards resolve through their component defaults.
 */
export function getAllowedBorderSides(
  node: Variant | Instance | Board,
  workspace: Workspace,
): BorderSideKey[] {
  const schemaKeys = new Set(getSchemaPropertyKeysForSubject(node, workspace))
  return BORDER_SIDE_KEYS.filter((side) => schemaKeys.has(side))
}

/**
 * Emits a compound row plus facet children for each border side the user has
 * shown, limited to sides the schema exposes. Rows render right after `border`
 * in the appearance section. Visibility is editor UI state, so nothing is
 * written to the node and the rows read their inherited schema values.
 */
function flattenShownBorderSides(
  node: Variant | Instance | Board,
  workspace: Workspace,
  mergedProperties: Properties,
  propertyStatus: Record<string, PropertyStatus>,
  shownSides: Set<BorderSideKey>,
  theme?: Theme,
): FlatProperty[] {
  const allowed = new Set(getAllowedBorderSides(node, workspace))
  const out: FlatProperty[] = []
  for (const side of BORDER_SIDE_KEYS) {
    if (!allowed.has(side) || !shownSides.has(side)) continue
    const value =
      resolvePropertyValueForDisplay(mergedProperties, side) || EMPTY_VALUE
    const status = propertyStatus[side] || "unset"
    out.push(createFlatProperty(side, value, status, node, workspace, theme))
    out.push(
      ...getSubProperties(
        side,
        value,
        workspace,
        node,
        propertyStatus,
        theme,
        mergedProperties,
      ),
    )
  }
  return out
}

function getSchemaPropertyKeysForSubject(
  node: Variant | Instance | Board,
  workspace: Workspace,
): string[] {
  if (isBoard(node)) {
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
  shownBorderSides: Set<BorderSideKey> = new Set(),
): FlatProperty[] {
  // A playground container is a sidebar-only grouping with no editable component
  // properties. Only the theme selector applies, and that row is added
  // separately, so emit no property rows here.
  if (isBoard(node) && isPlaygroundBoard(node)) {
    return []
  }

  const properties: FlatProperty[] = []
  const { properties: mergedProperties, propertyStatus } =
    getNodePropertiesWithStatus(node, workspace)

  const schemaPropertyKeys = getSchemaPropertyKeysForSubject(node, workspace)

  // Iterate the full catalog of top-level inspector rows. Keys not on the subject's
  // schema get status "not used" and are filtered out unless unused rows are shown.
  const allPropertyKeys = getInspectorRootPropertyKeys()

  for (const propertyKey of allPropertyKeys) {
    // Layered paint keys in the subject schema render one row per layer. Index 0
    // is the bottom layer; rows are emitted highest index first.
    if (
      isLayeredPaintProperty(propertyKey as CorePropertyKey) &&
      schemaPropertyKeys.includes(propertyKey)
    ) {
      properties.push(
        ...flattenLayeredPaintProperty(
          propertyKey as LayeredPaintKey,
          mergedProperties,
          propertyStatus,
          node,
          workspace,
          theme,
        ),
      )
      continue
    }

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

      // Shown border sides render as their own compound rows right after the
      // `border` row. Visibility is editor UI state, gated by the schema.
      if (propertyKey === "border") {
        properties.push(
          ...flattenShownBorderSides(
            node,
            workspace,
            mergedProperties,
            propertyStatus,
            shownBorderSides,
            theme,
          ),
        )
      }
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
