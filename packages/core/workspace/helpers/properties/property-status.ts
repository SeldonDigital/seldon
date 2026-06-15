import { type PropertyKey, type Theme, type Workspace } from "@seldon/core"
import { isCompoundProperty } from "@seldon/core/helpers/type-guards/compound/is-compound-property"
import type { Properties } from "@seldon/core/properties/types/properties"
import {
  type PropertyKey as CorePropertyKey,
  isLayeredPaintProperty,
} from "@seldon/core/properties/types/property-keys"
import { isBuiltInClearedLookToken } from "@seldon/core/themes/looks"

import { getNodeComputeContext } from "../../compute/compute-node-properties"
import { matchCompoundPreset } from "./compound-presets"
import {
  type PropertyPanelSubject,
  compoundSubPropertyPath,
  getCompoundLayerValue,
  getCompoundPropertyStructure,
  getEffectiveProperties,
  getLayeredPaintLayerCount,
  getPropertyOverridesBag,
  getSchemaProperties,
  getSubPropertyKeysFromSchema,
  getTypedNode,
  hasSchemaSubProperty,
  isShorthandProperty,
  isValueEmpty,
  isValueSet,
  layeredParentPropertyPath,
  propertyValuesMatch,
} from "./shared"

export type PropertyStatus = "set" | "unset" | "override" | "not used"

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

function hasSubPropertyOverride(
  node: PropertyPanelSubject,
  key: string,
  subKey: string,
  layerIndex: number = 0,
): boolean {
  const bag = getPropertyOverridesBag(node)
  if (!bag || !(key in bag)) return false
  const layer = getCompoundLayerValue(
    (bag as Record<string, unknown>)[key],
    layerIndex,
  )
  return !!(layer && subKey in layer)
}

function hasNonEmptySubProperties(propertyValue: unknown): boolean {
  const layer = getCompoundLayerValue(propertyValue)
  if (!layer) return false
  return Object.keys(layer)
    .filter((key) => key !== "preset")
    .some((key) => isValueSet(layer[key]))
}

function hasOverriddenSiblingProperties(
  node: PropertyPanelSubject,
  key: string,
  layerIndex: number = 0,
): boolean {
  const bag = getPropertyOverridesBag(node)
  if (!bag || !(key in bag)) return false
  const layer = getCompoundLayerValue(
    (bag as Record<string, unknown>)[key],
    layerIndex,
  )
  if (!layer) return false
  return Object.keys(layer)
    .filter((subKey) => subKey !== "preset")
    .some((subKey) => hasSubPropertyOverride(node, key, subKey, layerIndex))
}

function calculatePropertyStatus(
  key: string,
  hasNodeOverride: boolean,
  hasSchemaDefault: boolean,
  nodePropertyValue: unknown,
  schemaValue: unknown,
  node: PropertyPanelSubject,
): PropertyStatus {
  if (hasNodeOverride) {
    if (isCompoundProperty(key as PropertyKey)) {
      return hasOverriddenSiblingProperties(node, key)
        ? "override"
        : hasNonEmptySubProperties(nodePropertyValue)
          ? "set"
          : "unset"
    }

    if (
      hasSchemaDefault &&
      schemaValue &&
      propertyValuesMatch(nodePropertyValue, schemaValue)
    ) {
      return "set"
    }

    return "override"
  }

  if (hasSchemaDefault) {
    return isValueEmpty(schemaValue) ? "unset" : "set"
  }

  return "not used"
}

function calculateSubPropertyStatus(
  key: string,
  subKey: string,
  hasSubOverride: boolean,
  hasSubDefault: boolean,
  parentProperty: Record<string, unknown> | null,
  schemaSubValue: unknown,
  matchedCompoundPresetName: string | null,
): PropertyStatus {
  if (hasSubOverride) {
    if (isCompoundProperty(key as PropertyKey)) {
      if (subKey === "preset") {
        const subValue = parentProperty?.[subKey]
        if (
          hasSubDefault &&
          schemaSubValue &&
          propertyValuesMatch(subValue, schemaSubValue)
        ) {
          return "set"
        }
        return "override"
      }

      const subValue = parentProperty?.[subKey]
      return isValueEmpty(subValue) ? "unset" : "override"
    }

    return "override"
  }

  if (isCompoundProperty(key as PropertyKey) && subKey === "preset") {
    const siblingKeys = Object.keys(parentProperty ?? {}).filter(
      (siblingKey) => siblingKey !== "preset",
    )
    const allSiblingsUnset = siblingKeys.every((siblingKey) =>
      isValueEmpty(parentProperty?.[siblingKey]),
    )
    if (allSiblingsUnset) {
      const presetValue = parentProperty?.preset
      if (
        isBuiltInClearedLookToken(key, presetValue) ||
        isValueEmpty(presetValue)
      ) {
        return "set"
      }
      return "unset"
    }
    if (matchedCompoundPresetName) return "set"
    return hasNonEmptySubProperties(parentProperty) ? "override" : "set"
  }

  if (hasSubDefault) {
    return isValueEmpty(schemaSubValue) ? "unset" : "set"
  }

  return "not used"
}

function aggregateSubPropertyStatuses(
  subStatuses: PropertyStatus[],
): PropertyStatus {
  if (subStatuses.length === 0) {
    return "not used"
  }
  if (subStatuses.includes("not used")) {
    return "not used"
  }
  if (subStatuses.includes("override")) {
    return "override"
  }
  if (subStatuses.includes("set")) {
    return "set"
  }
  return "unset"
}

type SubStatusContext = {
  key: string
  nodeId: string
  workspace: Workspace
  node: PropertyPanelSubject
  schemaProperties: Properties
  effective: Properties
  theme: Theme | undefined
  status: Record<string, PropertyStatus>
}

/**
 * Writes per-facet status for one compound layer and records the layer's
 * aggregate at its parent path. `forceOverride` flags a layer that exists only
 * because the node added it beyond the schema default stack, so an empty added
 * paint layer still reads as an override.
 */
function assignCompoundLayerStatuses(
  ctx: SubStatusContext,
  compoundValue: unknown,
  schemaValue: unknown,
  layerIndex: number,
  forceOverride: boolean,
): PropertyStatus {
  const { key, nodeId, workspace, node, schemaProperties, theme, status } = ctx
  const parentKey = layeredParentPropertyPath(key, layerIndex)
  const compoundLayer = getCompoundLayerValue(compoundValue, layerIndex)
  if (!compoundLayer) {
    const fallback: PropertyStatus = forceOverride ? "override" : "unset"
    status[parentKey] = fallback
    return fallback
  }

  const subKeys = getCompoundPropertyStructure(
    key,
    compoundLayer,
    node,
    workspace,
  )
  const schemaLayer = getCompoundLayerValue(schemaValue)
  const matchedCompoundPresetName = matchCompoundPreset(
    key,
    nodeId,
    workspace,
    theme,
    layerIndex,
  )
  const subStatuses: PropertyStatus[] = []

  for (const subKey of subKeys) {
    const hasSubDefault = hasSchemaSubProperty(schemaProperties, key, subKey)
    const schemaSubValue = hasSubDefault ? schemaLayer?.[subKey] : null
    const subStatus = calculateSubPropertyStatus(
      key,
      subKey,
      hasSubPropertyOverride(node, key, subKey, layerIndex),
      hasSubDefault,
      compoundLayer,
      schemaSubValue,
      matchedCompoundPresetName,
    )
    status[compoundSubPropertyPath(key, subKey, layerIndex)] = subStatus
    if (subKey !== "preset") {
      subStatuses.push(subStatus)
    }
  }

  const aggregate = aggregateSubPropertyStatuses(subStatuses)
  const layerStatus: PropertyStatus =
    forceOverride && aggregate !== "override" ? "override" : aggregate
  status[parentKey] = layerStatus
  return layerStatus
}

/** Writes per-facet status for a compound property and its aggregate status. */
function assignCompoundStatuses(ctx: SubStatusContext): void {
  const { key, node, schemaProperties, effective } = ctx
  const compoundValue = (effective as Record<string, unknown>)[key]
  const schemaValue = (schemaProperties as Record<string, unknown> | null)?.[key]

  if (!isLayeredPaintProperty(key as CorePropertyKey)) {
    assignCompoundLayerStatuses(ctx, compoundValue, schemaValue, 0, false)
    return
  }

  // Layered paint owns a stack of layers. Layer 0 keeps its bare-key status,
  // upper layers report at `key.index`, and any layer beyond the schema default
  // stack length counts as an override because the node added it.
  const overrideValue = getPropertyOverridesBag(node)?.[key as keyof Properties]
  const overrideLayerCount = getLayeredPaintLayerCount(overrideValue)
  const schemaLayerCount = Math.max(getLayeredPaintLayerCount(schemaValue), 1)
  const effectiveLayerCount = Math.max(
    getLayeredPaintLayerCount(compoundValue),
    1,
  )

  for (let layerIndex = 0; layerIndex < effectiveLayerCount; layerIndex++) {
    const forceOverride =
      layerIndex >= schemaLayerCount && layerIndex < overrideLayerCount
    assignCompoundLayerStatuses(
      ctx,
      compoundValue,
      schemaValue,
      layerIndex,
      forceOverride,
    )
  }
}

/** Writes per-side status for a shorthand property and its aggregate status. */
function assignShorthandStatuses(ctx: SubStatusContext): void {
  const { key, workspace, node, schemaProperties, effective, status } = ctx
  const subKeys = getSubPropertyKeysFromSchema(key, node, workspace)
  const subStatuses: PropertyStatus[] = []

  for (const subKey of subKeys) {
    const hasSubDefault = hasSchemaSubProperty(schemaProperties, key, subKey)
    const shorthandSchemaValue = (
      schemaProperties as Record<string, Record<string, unknown> | undefined>
    )[key]
    const schemaSubValue = hasSubDefault
      ? (shorthandSchemaValue?.[subKey] ?? null)
      : null

    const subStatus = calculateSubPropertyStatus(
      key,
      subKey,
      hasSubPropertyOverride(node, key, subKey),
      hasSubDefault,
      (effective as Record<string, Record<string, unknown> | null>)[key] ??
        null,
      schemaSubValue,
      null,
    )

    status[`${key}.${subKey}`] = subStatus
    subStatuses.push(subStatus)
  }

  status[key] = aggregateSubPropertyStatuses(subStatuses)
}

export function getPropertyStatus(
  nodeId: string,
  workspace: Workspace,
): Record<string, PropertyStatus> {
  const node = getTypedNode(nodeId, workspace)
  const schemaProperties = getSchemaProperties(node, workspace)
  const status: Record<string, PropertyStatus> = {}
  if (!schemaProperties) return status

  const effective = getEffectiveProperties(nodeId, workspace)
  const bag = getPropertyOverridesBag(node)
  const { theme } = getNodeComputeContext(nodeId, workspace)

  for (const key of Object.keys(effective)) {
    const hasNodeOverride = hasPropertyOverride(node, key)
    const hasSchemaDefault = key in schemaProperties
    const nodeValue = hasNodeOverride ? bag?.[key as keyof Properties] : null
    const schemaValue = hasSchemaDefault
      ? (schemaProperties as Record<string, unknown>)[key]
      : null

    status[key] = calculatePropertyStatus(
      key,
      hasNodeOverride,
      hasSchemaDefault,
      nodeValue,
      schemaValue,
      node,
    )

    const subStatusContext: SubStatusContext = {
      key,
      nodeId,
      workspace,
      node,
      schemaProperties,
      effective,
      theme,
      status,
    }

    if (isCompoundProperty(key as PropertyKey)) {
      assignCompoundStatuses(subStatusContext)
    }

    if (isShorthandProperty(key)) {
      assignShorthandStatuses(subStatusContext)
    }
  }

  return status
}
