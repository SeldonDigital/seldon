import {
  type ComputedFunction,
  type Theme,
  Unit,
  ValueType,
  type Workspace,
} from "@seldon/core"
import {
  HSLObjectToString,
  LCHObjectToString,
  RGBObjectToString,
} from "@seldon/core/helpers/color"
import { formatPresetValue } from "@seldon/core/helpers/properties/format-preset-value"
import { parseThemeRef } from "@seldon/core/helpers/theme/get-theme-key-components"
import { getThemeValueName } from "@seldon/core/helpers/theme/get-theme-value-name"
import {
  isHSLObject,
  isLCHObject,
  isRGBObject,
} from "@seldon/core/helpers/type-guards"
import { COMPUTED_FUNCTION_DISPLAY_NAMES } from "@seldon/core/properties/compute"
import { getBuiltInLookSectionForPropertyKey } from "@seldon/core/themes/looks"
import type { NodeState } from "@seldon/core/workspace/model/node-state"

import { matchCompoundPreset } from "./compound-presets"
import {
  getCompoundLayerValue,
  getEffectiveProperties,
  getSubPropertyKeysFromSchema,
  getTypedNode,
  isValueSet,
} from "./shared"

type DimensionValue = {
  unit: string
  value: string | number
}

type PropertyValueLike = {
  type: ValueType
  value: unknown
}

type ComputedValueLike = {
  function: ComputedFunction
}

function isDimensionValue(value: unknown): value is DimensionValue {
  return !!(
    value &&
    typeof value === "object" &&
    "unit" in value &&
    "value" in value
  )
}

function isPropertyValueLike(value: unknown): value is PropertyValueLike {
  return !!(
    value &&
    typeof value === "object" &&
    "type" in value &&
    "value" in value
  )
}

function formatThemeValue(value: unknown, theme?: Theme): string {
  const token = String(value)
  if (token.startsWith("@") && theme) {
    return getThemeValueName(token, theme)
  }
  const optionId = parseThemeRef(token)?.optionId
  if (optionId) {
    return optionId.charAt(0).toUpperCase() + optionId.slice(1)
  }
  return token
}

function formatComputedValue(value: unknown): string {
  if (typeof value === "string") {
    return (
      COMPUTED_FUNCTION_DISPLAY_NAMES[value as ComputedFunction] ?? "Computed"
    )
  }
  if (value && typeof value === "object" && "function" in value) {
    const functionName = (value as ComputedValueLike).function
    return COMPUTED_FUNCTION_DISPLAY_NAMES[functionName] || functionName
  }
  return "Computed"
}

function formatDisplayValue(value: unknown, theme?: Theme): string {
  if (!isPropertyValueLike(value)) {
    return "Default"
  }

  if (value.type === ValueType.EMPTY) {
    return "Default"
  }

  if (value.type === ValueType.EXACT && isDimensionValue(value.value)) {
    if (value.value.unit === Unit.NUMBER) {
      return `${value.value.value}`
    }
    return `${value.value.value}${value.value.unit}`
  }

  if (value.type === ValueType.EXACT) {
    if (isHSLObject(value.value)) {
      return HSLObjectToString(value.value)
    }
    if (isRGBObject(value.value)) {
      return RGBObjectToString(value.value)
    }
    if (isLCHObject(value.value)) {
      return LCHObjectToString(value.value)
    }
  }

  if (
    value.type === ValueType.EXACT &&
    (typeof value.value === "string" ||
      typeof value.value === "number" ||
      typeof value.value === "boolean")
  ) {
    if (typeof value.value === "boolean") {
      return value.value ? "On" : "Off"
    }
    return String(value.value)
  }

  if (
    value.type === ValueType.THEME_CATEGORICAL ||
    value.type === ValueType.THEME_ORDINAL
  ) {
    return formatThemeValue(value.value, theme)
  }

  if (value.type === ValueType.OPTION) {
    return formatPresetValue(String(value.value))
  }

  if (value.type === ValueType.COMPUTED) {
    return formatComputedValue(value.value)
  }

  if (value.type === ValueType.INHERIT) {
    return "Inherit"
  }

  return "Has value"
}

export function formatValue(value: unknown, theme?: Theme): string {
  return formatDisplayValue(value, theme)
}

export function formatCompoundDisplay(
  propertyKey: string,
  nodeId: string,
  workspace: Workspace,
  theme?: Theme,
  layerIndex: number = 0,
  state?: NodeState,
): string {
  const effectiveProperties = getEffectiveProperties(nodeId, workspace, state)
  const parentLayer = getCompoundLayerValue(
    (effectiveProperties as Record<string, unknown>)[propertyKey],
    layerIndex,
  )
  if (!parentLayer) return "Default"

  // Background layers are typed by an explicit `kind` facet rather than theme
  // presets, so the row shows the kind label (None / Color / Image).
  if (propertyKey === "background") {
    return formatDisplayValue(parentLayer["kind"], theme)
  }

  const matchedPreset = matchCompoundPreset(
    propertyKey,
    nodeId,
    workspace,
    theme,
    layerIndex,
    state,
  )
  if (matchedPreset) return matchedPreset

  const hasCustomValue = Object.keys(parentLayer)
    .filter((key) => key !== "preset")
    .some((key) => isValueSet(parentLayer[key]))
  if (hasCustomValue) return "Custom"

  const builtInSection = getBuiltInLookSectionForPropertyKey(propertyKey)
  if (builtInSection) {
    return builtInSection === "font" ? "Normal" : "None"
  }

  return "Default"
}

export function formatShorthandDisplay(
  propertyKey: string,
  nodeId: string,
  workspace: Workspace,
  theme?: Theme,
  state?: NodeState,
): string {
  const effectiveProperties = getEffectiveProperties(nodeId, workspace, state)
  const node = getTypedNode(nodeId, workspace)
  const propertyValue = (
    effectiveProperties as Record<string, Record<string, unknown>>
  )[propertyKey]
  const subKeys = getSubPropertyKeysFromSchema(propertyKey, node, workspace)
  if (!subKeys.length) return "unset"

  const values: string[] = []
  let hasAnyValue = false
  for (const subKey of subKeys) {
    const subValue = propertyValue?.[subKey]
    if (!subValue) {
      values.push("Unset")
      continue
    }
    values.push(formatDisplayValue(subValue, theme))
    hasAnyValue = true
  }

  if (!hasAnyValue) return "unset"
  const allSame = values.every((value) => value === values[0])
  return allSame ? values[0] : values.join(" ")
}
