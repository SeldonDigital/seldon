import { type Theme, ValueType, type Workspace } from "@seldon/core"
import type { Properties } from "@seldon/core/properties/types/properties"
import {
  type ThemeLookPreset,
  getBuiltInLookSectionForPropertyKey,
  getThemeLookSection,
  isThemeLookPreset,
  readPresetThemeLookRef,
  resolveBuiltInLookApplyName,
  resolveThemeLook,
} from "@seldon/core/themes/looks"
import type { NodeState } from "@seldon/core/workspace/model/node-state"

import {
  type BoardCompound,
  applyBoardPreset,
  buildBoardCompoundReset,
  matchBoardCompoundPreset,
  resolveBoardPresetIdFromPickerValue,
} from "../../../properties/values/layout/board"
import {
  compoundFacetMatches,
  getCompoundLayerValue,
  getEffectiveProperties,
  getSchemaProperties,
  getSubPropertyKeysFromSchema,
  getTypedNode,
  wrapCompoundPropertyValue,
} from "./shared"

function isResetPreset(preset: string): boolean {
  return (
    preset === "Default" ||
    preset === "None" ||
    preset === "Normal" ||
    preset === "unset" ||
    preset === ""
  )
}

function buildResetProperties(
  propertyKey: string,
  subKeys: string[],
  schemaProperty: unknown,
): Properties {
  const emptyValue = { type: ValueType.EMPTY, value: null } as const
  const schemaLayer = getCompoundLayerValue(schemaProperty) ?? {}
  const facets: Record<string, unknown> = {}

  for (const subKey of subKeys) {
    if (subKey === "preset") continue
    const schemaSubValue = schemaLayer[subKey]
    facets[subKey] =
      schemaSubValue &&
      typeof schemaSubValue === "object" &&
      "type" in schemaSubValue &&
      schemaSubValue.type !== ValueType.EMPTY
        ? schemaSubValue
        : emptyValue
  }

  return wrapCompoundPropertyValue(propertyKey, facets)
}

function buildPresetProperties(
  propertyKey: string,
  _preset: ThemeLookPreset,
  subKeys: string[],
): Properties {
  // Applying a look stores the preset reference plus EMPTY facets. Compute-time
  // expansion (`expandLookPresetFacets`) fills each EMPTY facet from the look in
  // the active theme, so the value tracks both token changes and look
  // redefinition. Writing literal facet values here would freeze the look and
  // break that tracking. The explicit EMPTY facets also clear any prior facet
  // overrides so re-applying a look resets the compound.
  const facets: Record<string, unknown> = {}
  for (const subKey of subKeys) {
    facets[subKey] = { type: ValueType.EMPTY, value: null }
  }

  return wrapCompoundPropertyValue(propertyKey, facets)
}

function applyBoardPresetSelection(preset: string): Properties {
  const presetId = resolveBoardPresetIdFromPickerValue(preset)
  if (!presetId) {
    return {}
  }
  return { board: applyBoardPreset(presetId) }
}

function layerMatchesLookParameters(
  parentLayer: Record<string, unknown>,
  parameters: Record<string, unknown>,
): boolean {
  const entries = Object.entries(parameters)
  if (entries.length === 0) {
    return false
  }
  return entries.every(([subKey, expectedValue]) =>
    compoundFacetMatches(parentLayer, subKey, expectedValue),
  )
}

function matchThemePreset(
  propertyKey: string,
  effectiveProperties: Properties,
  theme: Theme,
  layerIndex: number = 0,
): string | null {
  const parentLayer = getCompoundLayerValue(
    (effectiveProperties as Record<string, unknown>)[propertyKey],
    layerIndex,
  )
  if (!parentLayer) {
    return null
  }

  const presetRef = readPresetThemeLookRef(parentLayer)
  if (presetRef) {
    const tetheredLook = resolveThemeLook(theme, propertyKey, presetRef)
    if (
      tetheredLook &&
      layerMatchesLookParameters(parentLayer, tetheredLook.parameters ?? {})
    ) {
      return tetheredLook.name ?? null
    }
  }

  const themeSection = getThemeLookSection(theme, propertyKey)
  if (!themeSection) {
    return null
  }

  for (const presetValue of Object.values(themeSection)) {
    if (!isThemeLookPreset(presetValue) || !presetValue.parameters) {
      continue
    }

    if (layerMatchesLookParameters(parentLayer, presetValue.parameters)) {
      return presetValue.name ?? null
    }
  }

  return null
}

export function applyCompoundPreset(
  propertyKey: string,
  preset: string | "Default" | "None" | "unset",
  nodeId: string,
  workspace: Workspace,
  theme?: Theme,
): Properties {
  const node = getTypedNode(nodeId, workspace)
  const schemaProperties = getSchemaProperties(node, workspace)
  const schemaProperty =
    schemaProperties?.[propertyKey as keyof typeof schemaProperties]
  const subKeys = getSubPropertyKeysFromSchema(propertyKey, node, workspace)

  if (isResetPreset(preset)) {
    if (propertyKey === "board") {
      const schemaBoard = getCompoundLayerValue(schemaProperty) as
        | BoardCompound
        | undefined
      return buildBoardCompoundReset(schemaBoard)
    }

    const builtInSection = getBuiltInLookSectionForPropertyKey(propertyKey)

    if (preset === "Default" || !builtInSection) {
      return buildResetProperties(propertyKey, subKeys, schemaProperty)
    }

    const builtInApplyName = resolveBuiltInLookApplyName(propertyKey, preset)
    if (!builtInApplyName || !theme) {
      return buildResetProperties(propertyKey, subKeys, schemaProperty)
    }

    const builtInLook = resolveThemeLook(theme, propertyKey, builtInApplyName)
    if (!builtInLook) {
      return buildResetProperties(propertyKey, subKeys, schemaProperty)
    }

    return buildPresetProperties(propertyKey, builtInLook, subKeys)
  }

  if (propertyKey === "board") {
    return applyBoardPresetSelection(preset)
  }

  if (!theme) {
    return {}
  }

  const presetValue = resolveThemeLook(theme, propertyKey, preset)
  if (!presetValue) {
    return {}
  }

  return buildPresetProperties(propertyKey, presetValue, subKeys)
}

export function matchCompoundPreset(
  propertyKey: string,
  nodeId: string,
  workspace: Workspace,
  theme?: Theme,
  layerIndex: number = 0,
  state?: NodeState,
): string | null {
  const effectiveProperties = getEffectiveProperties(nodeId, workspace, state)

  if (propertyKey === "board") {
    const boardLayer = getCompoundLayerValue(
      (effectiveProperties as Record<string, unknown>).board,
      layerIndex,
    ) as BoardCompound | undefined
    return matchBoardCompoundPreset(boardLayer)
  }

  if (!theme) {
    return null
  }

  return matchThemePreset(propertyKey, effectiveProperties, theme, layerIndex)
}
