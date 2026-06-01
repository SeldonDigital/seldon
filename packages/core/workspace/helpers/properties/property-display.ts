import {
  type ComputedFunction,
  type Theme,
  ValueType,
  type Workspace,
} from "@seldon/core"
import {
  HSLObjectToString,
  LCHObjectToString,
  RGBObjectToString,
} from "@seldon/core/helpers/color"
import { formatPresetValue } from "@seldon/core/helpers/properties/format-preset-value"
import {
  isHSLObject,
  isLCHObject,
  isRGBObject,
} from "@seldon/core/helpers/type-guards"
import { getThemeValueName } from "@seldon/core/helpers/theme/get-theme-value-name"
import { COMPUTED_FUNCTION_DISPLAY_NAMES } from "@seldon/core/properties/compute"
import {
  getCatalogKeyForPropertyPath,
  getPropertyOptions,
  getPropertySchema,
} from "@seldon/core/properties/schemas/helpers"
import type { PropertyValueType } from "@seldon/core/properties/types/schema"
import { getBuiltInLookSectionForPropertyKey } from "@seldon/core/themes/looks"
import { matchCompoundPreset } from "./compound-presets"
import {
  getCompoundLayerValue,
  getEffectiveProperties,
  getSubPropertyKeysFromSchema,
  getTypedNode,
  isValueSet,
} from "./shared"

const PICKER_VALUE_TYPES: readonly PropertyValueType[] = [
  "option",
  "themeCategorical",
  "themeOrdinal",
]

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

function pickerEntryToString(entry: unknown): string {
  if (
    entry &&
    typeof entry === "object" &&
    "value" in entry &&
    entry.value !== undefined
  ) {
    return String(entry.value)
  }
  return String(entry)
}

function getAllowedValuesForPath(
  path: string,
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
  if (token.startsWith("@")) {
    const parts = token.split(".")
    if (parts.length >= 2) {
      const lastSegment = parts[parts.length - 1]
      return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
    }
  }
  return token
}

function formatComputedValue(value: unknown): string {
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

export function getAllowedValues(
  path: string,
  _nodeId: string,
  workspace: Workspace,
  theme?: Theme,
): string[] {
  return getAllowedValuesForPath(path, workspace, theme)
}

export function formatValue(
  _path: string,
  value: unknown,
  _nodeId: string,
  _workspace: Workspace,
  theme?: Theme,
): string {
  return formatDisplayValue(value, theme)
}

export function formatCompoundDisplay(
  propertyKey: string,
  nodeId: string,
  workspace: Workspace,
  theme?: Theme,
): string {
  const effectiveProperties = getEffectiveProperties(nodeId, workspace)
  const parentLayer = getCompoundLayerValue(
    (effectiveProperties as Record<string, unknown>)[propertyKey],
  )
  if (!parentLayer) return "Default"

  const matchedPreset = matchCompoundPreset(propertyKey, nodeId, workspace, theme)
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
): string {
  const effectiveProperties = getEffectiveProperties(nodeId, workspace)
  const node = getTypedNode(nodeId, workspace)
  const propertyValue = (effectiveProperties as Record<string, Record<string, unknown>>)[
    propertyKey
  ]
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
