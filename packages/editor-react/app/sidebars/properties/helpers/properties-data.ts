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
  ControlType,
  getPropertyRegistryEntry,
} from "@seldon/editor/lib/icons/icons-registry"
import { THEME_TOKEN_ICON } from "@app/icons/resolve-option-icon"
import {
  childPathsUnderCompoundParent,
  getCompoundLayerValue,
  isLayeredPaintRoot,
  layeredFacetPath,
  layeredParentPath,
} from "@seldon/editor/lib/properties/property-paths"
import {
  BORDER_SIDE_KEYS,
  Board,
  BorderSideKey,
  COLOR_SIBLING_KEYS,
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
import { findInObject, isMatchColorValue } from "@seldon/core/helpers"
import {
  formatCompoundDisplay as coreFormatCompoundDisplay,
  formatShorthandDisplay as coreFormatShorthandDisplay,
  formatValue as coreFormatValue,
  getEffectiveProperties as coreGetEffectiveProperties,
  getPropertyStatus as coreGetPropertyStatus,
  getCompoundPropertyStructure,
} from "@seldon/core/helpers/properties/properties-bridge"
import { EMPTY_VALUE } from "@seldon/core/properties"
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
import { computeNodeProperties } from "@seldon/core/workspace/compute"
import { getComponentPropertyDefaults } from "@seldon/core/workspace/helpers/components/get-component-property-defaults"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { isPlaygroundBoard } from "@seldon/core/workspace/model/components"
import type { NodeState } from "@seldon/core/workspace/model/node-state"
import { getNodeCatalogComponentId } from "@seldon/editor/lib/workspace/node-tree"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import {
  type PropertyType,
  isCompoundProperty,
  isShorthandProperty,
} from "./property-types"
import {
  createSubPropertyLabel,
  formatPropertyLabel,
  getValueType,
} from "./shared-utils"

const UNKNOWN_VALUE = "unknown"
const UNKNOWN_DISPLAY = "Error"

function facetAllowsAuthoredComputed(subPropertyPath: string): boolean {
  const catalogKey = getCatalogKeyForPropertyPath(subPropertyPath)
  if (!catalogKey) return false
  const schema = getPropertySchema(catalogKey)
  return schema?.supports.includes("computed") ?? false
}

type PropertyStatus = "set" | "unset" | "override" | "not used" | "error"

export interface FlatProperty {
  key: string
  propertyType: PropertyType
  label: string
  icon: string
  value: unknown
  actualValue: string
  valueType: ValueType
  controlType?: ControlType
  /**
   * Allowed unit suffixes for a measured theme value, resolved from the core
   * token schema. Present only on theme rows that declare a unit; absent on node
   * properties, which resolve units through the property schema instead.
   */
  units?: string[]
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
 * Whether a compound's parent row renders a selector combo. Compounds whose
 * core selector facet is `kind` (background) always do; other compounds only
 * when the theme offers presets.
 */
function hasCompoundSelectorCombo(
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

/**
 * Checks if a compound property has preset options available in the theme
 * @param propertyKey - The compound property key (e.g., "background", "border")
 * @param theme - Optional theme to check for preset options
 * @returns True if the theme has a section for this property with preset options
 */
function hasCompoundPresetOptions(
  propertyKey: string,
  theme?: Theme,
  workspace?: Workspace,
): boolean {
  if (!isCompoundProperty(propertyKey)) {
    return false
  }

  const presetSchema = getCompoundSubPropertySchema(propertyKey, "preset")
  if (presetSchema?.presetOptions) {
    const presetSchemaKey = `${propertyKey}Preset`
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

/** The sub-property rows a compound or shorthand parent row recurses into. */
export function getCompoundChildRows(
  parentKey: string,
  allProperties: FlatProperty[],
): FlatProperty[] {
  return allProperties.filter(
    (candidate) =>
      candidate.isSubProperty &&
      childPathsUnderCompoundParent(parentKey, candidate.key),
  )
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
  state?: NodeState,
): { properties: Properties; propertyStatus: Record<string, PropertyStatus> } {
  const subjectId = getPropertiesSubjectId(node)
  const properties = coreGetEffectiveProperties(subjectId, workspace, state)
  const propertyStatus = coreGetPropertyStatus(
    subjectId,
    workspace,
    state,
  ) as Record<string, PropertyStatus>

  return { properties, propertyStatus }
}

/**
 * Gets sub-properties for shorthand properties. Side keys come from dotted
 * entries in the merged properties, falling back to the registry's declared
 * sub-properties.
 */
function getShorthandSubProperties(
  propertyKey: string,
  workspace: Workspace,
  node: Variant | Instance | Board,
  propertyStatus: Record<string, PropertyStatus>,
  mergedProperties: Properties,
  theme?: Theme,
): FlatProperty[] {
  const subEntries: string[] = []
  for (const key of Object.keys(mergedProperties)) {
    if (key.startsWith(`${propertyKey}.`)) {
      subEntries.push(key.substring(propertyKey.length + 1))
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
      findInObject(mergedProperties, subPropertyPath) || EMPTY_VALUE
    const subStatus = propertyStatus[subPropertyPath] || "not used"

    subProperties.push(
      createFlatSubProperty(
        propertyKey,
        subKey,
        subPropertyValue,
        subStatus,
        node,
        workspace,
        theme,
      ),
    )
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

  if (isComboControl || isImageProperty || !basePropertyName) {
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
function createFlatProperty(
  propertyKey: string,
  propertyValue: unknown,
  status: PropertyStatus,
  node: Variant | Instance | Board,
  workspace: Workspace,
  theme?: Theme,
  state?: NodeState,
  matchLock?: { displayValue: unknown } | null,
  layerIndex: number = 0,
): FlatProperty {
  const registryEntry = getPropertyRegistryEntry(propertyKey)
  const isCompound = isCompoundProperty(propertyKey as PropertyKey)
  const isShorthand = isShorthandProperty(propertyKey as PropertyKey)

  // A top-level `brightness`/`opacity` locked to a Match Color sibling shows the
  // mirrored source value and renders dimmed, matching the compound/layer rows.
  if (matchLock) {
    propertyValue = matchLock.displayValue
  }

  let actualValue = UNKNOWN_VALUE
  let hasError = false

  if (isCompound) {
    try {
      actualValue = coreFormatCompoundDisplay(
        propertyKey,
        getPropertiesSubjectId(node),
        workspace,
        theme,
        layerIndex,
        state,
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
        state,
      )
    } catch {
      actualValue = UNKNOWN_DISPLAY
      hasError = true
    }
  } else {
    try {
      actualValue = coreFormatValue(propertyValue, theme)
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
    icon: registryEntry?.icon || THEME_TOKEN_ICON,
    isDimmed: !!matchLock,
  }
}

/**
 * Sibling brightness/opacity facet -> the color facet it mirrors, and which percentage it is.
 * Derived from the shared core `COLOR_SIBLING_KEYS` so the editor lock stays aligned with the
 * compute mirror and the workspace validation lock.
 */
const MATCH_SIBLING_FACETS: Record<
  string,
  { colorKey: string; kind: "brightness" | "opacity" }
> = Object.fromEntries(
  Object.entries(COLOR_SIBLING_KEYS).flatMap(([colorKey, siblingKeys]) => [
    [siblingKeys.brightness, { colorKey, kind: "brightness" as const }],
    [siblingKeys.opacity, { colorKey, kind: "opacity" as const }],
  ]),
)

/**
 * Decides whether a `brightness`/`opacity` facet is locked to a Match Color and what value to show.
 * A facet is locked when its sibling color in `layer` resolves to Match Color and the node theme's
 * matching toggle is on. The displayed value comes from the node's computed properties, so the row
 * shows the mirrored source value rather than the unset authored value.
 */
function resolveMatchSiblingLock(
  subKey: string,
  subPropertyPath: string,
  layer: Record<string, unknown> | undefined | null,
  node: Variant | Instance | Board,
  workspace: Workspace,
  theme?: Theme,
): { displayValue: unknown } | null {
  const sibling = MATCH_SIBLING_FACETS[subKey]
  if (!sibling || !layer) return null
  if (!isMatchColorValue(layer[sibling.colorKey])) return null

  const params = theme?.matchColor?.parameters
  const enabled =
    sibling.kind === "brightness"
      ? !!params?.includeBrightness
      : !!params?.includeOpacity
  if (!enabled) return null

  let displayValue: unknown
  try {
    const computed = computeNodeProperties(
      getPropertiesSubjectId(node),
      workspace as never,
    )
    displayValue = findInObject(computed, subPropertyPath)
  } catch {
    displayValue = undefined
  }

  return { displayValue: displayValue ?? EMPTY_VALUE }
}

function createFlatSubProperty(
  propertyKey: string,
  subKey: string,
  subValue: unknown,
  status: PropertyStatus,
  node: Variant | Instance | Board,
  workspace: Workspace,
  theme?: Theme,
  layerIndex: number = 0,
  matchLock?: { displayValue: unknown } | null,
): FlatProperty {
  const subPropertyPath = subPropertyPathFor(propertyKey, subKey, layerIndex)
  const subRegistryEntry = getPropertyRegistryEntry(subPropertyPath)

  if (matchLock) {
    subValue = matchLock.displayValue
  }

  const isDimmed =
    !!matchLock ||
    (subValue &&
      typeof subValue === "object" &&
      subValue !== null &&
      "type" in subValue &&
      subValue.type === ValueType.COMPUTED &&
      !facetAllowsAuthoredComputed(subPropertyPath))

  const isInvalidExact = isInvalidExactStringValue(
    subPropertyPath,
    subValue,
    subRegistryEntry?.control,
    theme,
  )

  let actualValue = UNKNOWN_VALUE
  let formatFailed = false
  try {
    actualValue = coreFormatValue(subValue, theme)
  } catch {
    actualValue = UNKNOWN_DISPLAY
    formatFailed = true
  }
  if (!formatFailed && isInvalidExact) {
    actualValue = (subValue as Record<string, unknown>).value as string
  }

  return {
    key: subPropertyPath,
    propertyType: "atomic", // Sub-properties are always atomic
    label: createSubPropertyLabel(propertyKey, subKey, subRegistryEntry?.label),
    icon: subRegistryEntry?.icon || THEME_TOKEN_ICON,
    value: subValue || EMPTY_VALUE,
    actualValue,
    valueType: getValueType(subValue),
    controlType: subRegistryEntry?.control,
    isCompound: false,
    isShorthand: false,
    isSubProperty: true,
    isDimmed: !!isDimmed,
    status: isInvalidExact ? "error" : status,
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

    const matchLock = resolveMatchSiblingLock(
      subKey,
      subPropertyPath,
      layer,
      node,
      workspace,
      theme,
    )

    const flatSubProperty = createFlatSubProperty(
      propertyKey,
      subKey,
      subValue,
      status,
      node,
      workspace,
      theme,
      layerIndex,
      matchLock,
    )

    subProperties.push(flatSubProperty)
  }

  return subProperties
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
  state?: NodeState,
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
        state,
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
      // An upper paint layer (index >= 1) mirrors the index-0 compound row: a
      // preset combo plus expandable facet children. Its key and `layerIndex`
      // address the slot so the commit leaves the other layers intact.
      const layerValue = getCompoundLayerValue(rawArray, i) || EMPTY_VALUE
      const parent = createFlatProperty(
        propertyKey,
        layerValue,
        propertyStatus[layeredParentPath(propertyKey, i)] ?? "unset",
        node,
        workspace,
        theme,
        state,
        null,
        i,
      )
      parent.key = layeredParentPath(propertyKey, i)
      parent.label = `${baseLabel} ${i + 1}`
      parent.layerIndex = i
      out.push(parent)
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
  state?: NodeState,
): FlatProperty[] {
  const allowed = new Set(getAllowedBorderSides(node, workspace))
  const out: FlatProperty[] = []
  for (const side of BORDER_SIDE_KEYS) {
    if (!allowed.has(side) || !shownSides.has(side)) continue
    const value =
      resolvePropertyValueForDisplay(mergedProperties, side) || EMPTY_VALUE
    const status = propertyStatus[side] || "unset"
    out.push(
      createFlatProperty(side, value, status, node, workspace, theme, state),
    )
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
  state?: NodeState,
): FlatProperty[] {
  // A playground container is a sidebar-only grouping with no editable component
  // properties. Only the theme selector applies, and that row is added
  // separately, so emit no property rows here.
  if (isBoard(node) && isPlaygroundBoard(node)) {
    return []
  }

  const properties: FlatProperty[] = []
  const { properties: mergedProperties, propertyStatus } =
    getNodePropertiesWithStatus(node, workspace, state)

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
          state,
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

    // Lock a top-level `brightness`/`opacity` whose sibling `color` is Match Color,
    // the same rule used for compound and layer facets.
    const matchLock = resolveMatchSiblingLock(
      propertyKey,
      propertyKey,
      mergedProperties,
      node,
      workspace,
      theme,
    )

    const flatProperty = createFlatProperty(
      propertyKey,
      finalPropertyValue,
      status,
      node,
      workspace,
      theme,
      state,
      matchLock,
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
            state,
          ),
        )
      }
    } else if (flatProperty.isShorthand) {
      const subProperties = getShorthandSubProperties(
        propertyKey,
        workspace,
        node,
        propertyStatus,
        mergedProperties,
        theme,
      )
      properties.push(...subProperties)
    }
  }

  return properties
}
