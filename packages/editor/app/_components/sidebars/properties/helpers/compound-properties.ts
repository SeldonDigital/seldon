import { Theme, ValueType, Workspace } from "@seldon/core"
import {
  applyCompoundPreset as coreApplyCompoundPreset,
  formatCompoundDisplay as coreFormatCompoundDisplay,
  matchCompoundPreset as coreMatchCompoundPreset,
} from "@seldon/core/helpers/properties/properties-bridge"
import { Board, Instance, Variant } from "@seldon/core/workspace/types"
import {
  getCompoundLayerValue,
  isLayeredPaintRoot,
  layeredFacetPath,
} from "@lib/properties-ui/property-paths"
import type { LayeredPaintKey } from "@seldon/core/properties/types/property-keys"
import {
  getNodePropertiesWithStatus,
  getPropertiesSubjectId,
} from "./properties-data"
import {
  getParentPropertyKey,
  isCompoundProperty as isCompoundPropertyBase,
} from "./property-types"

export const isCompoundProperty = isCompoundPropertyBase

/**
 * Gets sibling sub-property keys for a given preset property
 * @param presetPropertyKey - The preset property key (e.g., "border.preset")
 * @param workspace - Current workspace
 * @param node - Node to get properties from
 * @param theme - Optional theme for property resolution
 * @returns Array of sibling sub-property keys
 */
export function getSiblingSubPropertyKeys(
  presetPropertyKey: string,
  workspace: Workspace,
  node: Variant | Instance | Board,
): string[] {
  const parentKey = getParentPropertyKey(presetPropertyKey)
  const { properties } = getNodePropertiesWithStatus(node, workspace)

  const layer = getCompoundLayerValue(
    (properties as Record<string, unknown>)[parentKey],
  )
  if (!layer) {
    return []
  }

  return Object.keys(layer)
    .filter((key) => key !== "preset")
    .map((key) =>
      isLayeredPaintRoot(parentKey)
        ? layeredFacetPath(parentKey as LayeredPaintKey, key)
        : `${parentKey}.${key}`,
    )
}

/**
 * Gets the display value for a preset property
 * @param presetPropertyKey - The preset property key
 * @param presetPropertyValue - The preset property value
 * @param workspace - Current workspace
 * @param node - Node containing the property
 * @param theme - Optional theme for property resolution
 * @returns Display string for the preset property
 */
export function getPresetPropertyDisplayValue(
  presetPropertyKey: string,
  workspace: Workspace,
  node: Variant | Instance | Board,
  theme?: Theme,
): string {
  const parentKey = getParentPropertyKey(presetPropertyKey)
  const subjectId = getPropertiesSubjectId(node)
  const matched = coreMatchCompoundPreset(
    parentKey,
    subjectId,
    workspace as unknown as Workspace,
    theme,
  )
  if (matched) return matched
  return coreFormatCompoundDisplay(
    parentKey,
    subjectId,
    workspace as unknown as Workspace,
    theme,
  )
}

/**
 * Creates a preset property update with theme token handling
 * @param presetPropertyKey - The preset property key
 * @param presetValue - The preset value (can be theme token or preset name)
 * @param workspace - Current workspace
 * @param node - Node to update
 * @param theme - Optional theme for token resolution
 * @returns Update object for the preset property
 */
export function createPresetPropertyUpdate(
  presetPropertyKey: string,
  presetValue: string,
  workspace: Workspace,
  node: Variant | Instance | Board,
  theme?: Theme,
): Record<string, unknown> {
  const parentKey = getParentPropertyKey(presetPropertyKey)
  let presetForCore: string = presetValue
  let tokenForPreset: string | null = null

  if (typeof presetValue === "string" && presetValue.startsWith("@") && theme) {
    const token = presetValue.substring(1)
    const [section, id] = token.split(".")
    const sectionObj = (theme as Record<string, unknown>)[section]
    if (
      sectionObj &&
      (sectionObj as Record<string, unknown>)[id] &&
      typeof (sectionObj as Record<string, unknown>)[id] === "object" &&
      "name" in ((sectionObj as Record<string, unknown>)[id] as object)
    ) {
      presetForCore = String(
        ((sectionObj as Record<string, unknown>)[id] as { name: string }).name,
      )
      tokenForPreset = `@${section}.${id}`
    }
  }

  const applied = coreApplyCompoundPreset(
    parentKey,
    presetForCore,
    getPropertiesSubjectId(node),
    workspace as unknown as Workspace,
    theme,
  ) as Record<string, unknown>

  if (tokenForPreset && applied && applied[parentKey]) {
    const presetCell = {
      type: ValueType.THEME_CATEGORICAL,
      value: tokenForPreset,
    }
    if (isLayeredPaintRoot(parentKey)) {
      const layer = getCompoundLayerValue(applied[parentKey]) ?? {}
      applied[parentKey] = [{ ...layer, preset: presetCell }]
    } else {
      applied[parentKey] = {
        ...(applied[parentKey] as Record<string, unknown>),
        preset: presetCell,
      }
    }
  }

  return applied
}

/**
 * Creates a compound property update
 * @param propertyKey - The property key
 * @param presetValue - The preset value
 * @param workspace - Current workspace
 * @param node - Node to update
 * @param theme - Optional theme
 * @returns Update object for the compound property
 */
export function createCompoundPropertyUpdate(
  propertyKey: string,
  presetValue: string,
  workspace: Workspace,
  node: Variant | Instance | Board,
  theme?: Theme,
): Record<string, unknown> {
  return coreApplyCompoundPreset(
    propertyKey,
    presetValue,
    getPropertiesSubjectId(node),
    workspace as unknown as Workspace,
    theme,
  )
}

/**
 * Checks if a property is a compound compound property
 * @param property - Property object with type and key
 * @returns True if property is compound type and has compound key
 */
export function isCompoundCompoundProperty(property: {
  propertyType: string
  key: string
}): boolean {
  return (
    property.propertyType === "compound" && isCompoundPropertyBase(property.key)
  )
}
