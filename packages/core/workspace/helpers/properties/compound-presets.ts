import { type Theme, ValueType, type Workspace } from "@seldon/core"
import type { Properties } from "@seldon/core/properties/types/properties"
import {
  applyBoardPreset,
  buildBoardCompoundReset,
  matchBoardCompoundPreset,
  resolveBoardPresetIdFromPickerValue,
  type BoardCompound,
} from "../../../properties/values/layout/board"
import {
  getCompoundLayerValue,
  getEffectiveProperties,
  getSchemaProperties,
  getSubPropertyKeysFromSchema,
  getTypedNode,
  propertyValuesMatch,
  wrapCompoundPropertyValue,
} from "./shared"

type ThemePreset = {
  name: string
  parameters?: Record<string, unknown>
}

function isThemePreset(value: unknown): value is ThemePreset {
  return !!(
    value &&
    typeof value === "object" &&
    "name" in value &&
    typeof value.name === "string"
  )
}

function isResetPreset(preset: string): boolean {
  return (
    preset === "Default" ||
    preset === "None" ||
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

function findPresetInTheme(
  theme: Theme,
  propertyKey: string,
  presetName: string,
): ThemePreset | null {
  const themeSection = (theme as Record<string, unknown>)[propertyKey]
  if (!themeSection || typeof themeSection !== "object") {
    return null
  }

  for (const presetValue of Object.values(themeSection)) {
    if (isThemePreset(presetValue) && presetValue.name === presetName) {
      return presetValue
    }
  }

  return null
}

function convertPresetValue(subValue: unknown): unknown {
  if (typeof subValue === "string" && subValue.startsWith("@")) {
    return {
      type: ValueType.THEME_CATEGORICAL,
      value: subValue,
    }
  }
  if (
    subValue &&
    typeof subValue === "object" &&
    "type" in subValue &&
    "value" in subValue
  ) {
    return subValue
  }
  if (subValue && typeof subValue === "object") {
    return {
      type: ValueType.EXACT,
      value: subValue,
    }
  }
  return { type: ValueType.EXACT, value: subValue }
}

function buildPresetProperties(
  propertyKey: string,
  preset: ThemePreset,
  subKeys: string[],
): Properties {
  const facets: Record<string, unknown> = {}

  for (const [subKey, subValue] of Object.entries(preset.parameters ?? {})) {
    facets[subKey] = convertPresetValue(subValue)
  }

  const presentKeys = new Set(Object.keys(facets).filter((key) => key !== "preset"))
  for (const subKey of subKeys) {
    if (!presentKeys.has(subKey)) {
      facets[subKey] = { type: ValueType.EMPTY, value: null }
    }
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

function matchThemePreset(
  propertyKey: string,
  effectiveProperties: Properties,
  theme: Theme,
): string | null {
  const parentLayer = getCompoundLayerValue(
    (effectiveProperties as Record<string, unknown>)[propertyKey],
  )
  const themeSection = (theme as Record<string, unknown>)[propertyKey]
  if (!themeSection || typeof themeSection !== "object" || !parentLayer) {
    return null
  }

  for (const presetValue of Object.values(themeSection)) {
    if (!isThemePreset(presetValue) || !presetValue.parameters) {
      continue
    }

    const matches = Object.entries(presetValue.parameters).every(
      ([subKey, expectedValue]) =>
        propertyValuesMatch(parentLayer[subKey], expectedValue),
    )

    if (matches) {
      return presetValue.name
    }
  }

  return null
}

export function expandShorthand(
  propertyKey: string,
  value: unknown,
  nodeId: string,
  workspace: Workspace,
): Properties {
  const node = getTypedNode(nodeId, workspace)
  const subKeys = getSubPropertyKeysFromSchema(propertyKey, node, workspace)
  const shorthandValue =
    value && typeof value === "object" && "type" in value
      ? value
      : { type: ValueType.EXACT, value }

  const result: Record<string, unknown> = {}
  for (const subKey of subKeys) {
    result[subKey] = shorthandValue
  }

  return { [propertyKey]: result }
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
  const schemaProperty = schemaProperties?.[
    propertyKey as keyof typeof schemaProperties
  ]
  const subKeys = getSubPropertyKeysFromSchema(propertyKey, node, workspace)

  if (isResetPreset(preset)) {
    if (propertyKey === "board") {
      const schemaBoard = getCompoundLayerValue(schemaProperty) as
        | BoardCompound
        | undefined
      return buildBoardCompoundReset(schemaBoard)
    }
    return buildResetProperties(propertyKey, subKeys, schemaProperty)
  }

  if (propertyKey === "board") {
    return applyBoardPresetSelection(preset)
  }

  if (!theme) {
    return {}
  }
  const presetValue = findPresetInTheme(theme, propertyKey, preset)
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
): string | null {
  const effectiveProperties = getEffectiveProperties(nodeId, workspace)

  if (propertyKey === "board") {
    const boardLayer = getCompoundLayerValue(
      (effectiveProperties as Record<string, unknown>).board,
    ) as BoardCompound | undefined
    return matchBoardCompoundPreset(boardLayer)
  }

  if (!theme) {
    return null
  }

  return matchThemePreset(propertyKey, effectiveProperties, theme)
}
