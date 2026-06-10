import { ValueType } from "../../properties/constants"
import type { Properties } from "../../properties/types/properties"
import type { Theme } from "../types"
import {
  type BuiltInLookSection,
  getBuiltInLookSectionForPropertyKey,
} from "./built-in-looks"
import { LOOK_FACETS } from "./look-facets"
import { readPresetThemeLookRef, resolveThemeLook } from "./resolve-theme-look"

const EMPTY_VALUE = { type: ValueType.EMPTY, value: null } as const

/** Converts a raw look parameter into a tagged property value. */
export function convertLookParameterValue(subValue: unknown): unknown {
  if (typeof subValue === "string" && subValue.startsWith("@")) {
    return { type: ValueType.THEME_CATEGORICAL, value: subValue }
  }
  if (
    subValue &&
    typeof subValue === "object" &&
    "type" in subValue &&
    "value" in subValue
  ) {
    return subValue
  }
  return { type: ValueType.EXACT, value: subValue }
}

function isEmptyTaggedValue(value: unknown): boolean {
  return (
    !!value &&
    typeof value === "object" &&
    "type" in value &&
    (value as { type: unknown }).type === ValueType.EMPTY
  )
}

function isFacetObject(value: unknown): value is Record<string, unknown> {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !("type" in value)
  )
}

/**
 * Expands a single compound layer that carries a theme-categorical preset
 * facet. The look's parameters fill the section's facets, facets the look does
 * not define become explicit EMPTY, and the layer's own non-EMPTY facets win
 * over the look. The preset facet is kept for preset matching.
 */
function expandLayer(
  section: BuiltInLookSection,
  propertyKey: string,
  layer: Record<string, unknown>,
  theme: Theme,
): Record<string, unknown> {
  const presetRef = readPresetThemeLookRef(layer)
  if (!presetRef) return layer

  const look = resolveThemeLook(theme, propertyKey, presetRef)
  if (!look) return layer

  const facets: Record<string, unknown> = {}
  for (const entry of LOOK_FACETS[section]) {
    facets[entry.facet] = EMPTY_VALUE
  }
  for (const [facetKey, parameter] of Object.entries(look.parameters ?? {})) {
    if (facetKey === "preset") continue
    facets[facetKey] = convertLookParameterValue(parameter)
  }
  for (const [facetKey, value] of Object.entries(layer)) {
    if (facetKey === "preset") continue
    if (value !== undefined && !isEmptyTaggedValue(value)) {
      facets[facetKey] = value
    }
  }

  return { preset: layer.preset, ...facets }
}

function expandPropertyValue(
  section: BuiltInLookSection,
  propertyKey: string,
  value: unknown,
  theme: Theme,
): unknown {
  if (Array.isArray(value)) {
    let changed = false
    const layers = value.map((layer) => {
      if (!isFacetObject(layer)) return layer
      const expanded = expandLayer(section, propertyKey, layer, theme)
      if (expanded !== layer) changed = true
      return expanded
    })
    return changed ? layers : value
  }

  if (isFacetObject(value)) {
    return expandLayer(section, propertyKey, value, theme)
  }

  return value
}

function layerHasPresetRef(value: unknown): boolean {
  return isFacetObject(value) && readPresetThemeLookRef(value) !== null
}

/** True when any look-bridged compound in the snapshot carries a preset ref. */
export function hasExpandableLookPreset(properties: Properties): boolean {
  for (const [key, value] of Object.entries(properties)) {
    if (!getBuiltInLookSectionForPropertyKey(key)) continue
    if (Array.isArray(value)) {
      if (value.some(layerHasPresetRef)) return true
    } else if (layerHasPresetRef(value)) {
      return true
    }
  }
  return false
}

/**
 * Expands look preset facets in one property snapshot. Only keys that bridge
 * to a theme look section change: layered paint values expand per layer, facet
 * compounds expand in place. Everything else is returned untouched.
 */
export function expandLookPresetFacets(
  properties: Properties,
  theme: Theme,
): Properties {
  let changed = false
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(properties)) {
    const section = getBuiltInLookSectionForPropertyKey(key)
    if (!section) {
      result[key] = value
      continue
    }
    const expanded = expandPropertyValue(section, key, value, theme)
    if (expanded !== value) changed = true
    result[key] = expanded
  }

  return changed ? (result as Properties) : properties
}
