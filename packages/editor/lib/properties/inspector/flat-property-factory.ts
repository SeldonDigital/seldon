/**
 * Builds `FlatProperty` rows for atomic, compound, and shorthand properties,
 * including compound/shorthand facet children. Value formatting, status, and
 * schema lookups delegate to core; this module adds the inspector's row shape
 * and UI metadata.
 */
import { getPropertyRegistryEntry } from "@seldon/editor/lib/icons/icons-registry"
import type { ControlType } from "@seldon/editor/lib/icons/icons-registry"
import { THEME_TOKEN_ICON } from "@seldon/editor/lib/icons/resolve-option-icon"
import {
  getCompoundLayerValue,
  isLayeredPaintRoot,
  layeredFacetPath,
} from "@seldon/editor/lib/properties/property-paths"
import {
  Board,
  Instance,
  Properties,
  PropertyKey,
  Theme,
  ValueType,
  Variant,
  Workspace,
  getCompoundSelectorFacet,
} from "@seldon/core"
import { findInObject } from "@seldon/core/helpers"
import {
  formatCompoundDisplay as coreFormatCompoundDisplay,
  formatShorthandDisplay as coreFormatShorthandDisplay,
  formatValue as coreFormatValue,
  getCompoundPropertyStructure,
} from "@seldon/core/helpers/properties/properties-bridge"
import { EMPTY_VALUE } from "@seldon/core/properties"
import {
  getCompoundSubPropertySchema,
  getPropertyCategory,
} from "@seldon/core/properties/schemas"
import {
  getCatalogKeyForPropertyPath,
  getPropertySchema,
  validatePropertyValue,
} from "@seldon/core/properties/schemas/helpers"
import { getPresetOptions } from "@seldon/core/properties/schemas/helpers/property-options"
import type { LayeredPaintKey } from "@seldon/core/properties/types/property-keys"
import type { NodeState } from "@seldon/core/workspace/model/node-state"
import {
  isCompoundProperty,
  isShorthandProperty,
} from "@seldon/editor/lib/properties/property-types"
import {
  createSubPropertyLabel,
  formatPropertyLabel,
  getValueType,
} from "@seldon/editor/lib/properties/shared-utils"
import { getPropertiesSubjectId } from "./flat-property"
import type { FlatProperty, PropertyStatus } from "./flat-property"
import { resolveMatchSiblingLock } from "./match-color-lock"
import { resolvePropertyValueForDisplay } from "./properties-read"

const UNKNOWN_VALUE = "unknown"
const UNKNOWN_DISPLAY = "Error"

function facetAllowsAuthoredComputed(subPropertyPath: string): boolean {
  const catalogKey = getCatalogKeyForPropertyPath(subPropertyPath)
  if (!catalogKey) return false
  const schema = getPropertySchema(catalogKey)
  return schema?.supports.includes("computed") ?? false
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

/**
 * Gets sub-properties for shorthand properties. Side keys come from dotted
 * entries in the merged properties, falling back to the registry's declared
 * sub-properties.
 */
export function getShorthandSubProperties(
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
export function createFlatProperty(
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

export function getSubProperties(
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
