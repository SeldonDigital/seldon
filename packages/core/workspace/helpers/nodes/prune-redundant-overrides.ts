import type { Properties } from "../../../properties/types/properties"
import type {
  PropertyKey,
  SubPropertyKey,
} from "../../../properties/types/property-keys"
import { isLayeredPaintProperty } from "../../../properties/types/property-keys"
import { readPropertySlice } from "./resolve-node-property-reset"

interface TouchedFacet {
  propertyKey: PropertyKey
  subpropertyKey?: SubPropertyKey
  /** Paint-layer slot for layered properties; defaults to layer 0. */
  layerIndex?: number
}

function isTaggedValue(value: unknown): boolean {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "type" in (value as Record<string, unknown>)
  )
}

function toLayerArray(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value as Record<string, unknown>[]
  if (value && typeof value === "object") {
    return [value as Record<string, unknown>]
  }
  return []
}

/**
 * Enumerates the leaf facets a property patch actually writes. Atomic values map
 * to a top-level key, compound and shorthand bags to their sub-keys, and layered
 * paint to each `(layerIndex, sub-key)` slot present in the patch.
 */
function enumeratePatchFacets(patch: Properties): TouchedFacet[] {
  const facets: TouchedFacet[] = []

  for (const [key, value] of Object.entries(patch)) {
    const propertyKey = key as PropertyKey

    if (isLayeredPaintProperty(propertyKey)) {
      toLayerArray(value).forEach((layer, layerIndex) => {
        if (layer && typeof layer === "object" && !Array.isArray(layer)) {
          for (const subKey of Object.keys(layer)) {
            facets.push({
              propertyKey,
              subpropertyKey: subKey as SubPropertyKey,
              layerIndex,
            })
          }
        }
      })
      continue
    }

    if (isTaggedValue(value)) {
      facets.push({ propertyKey })
      continue
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const subKey of Object.keys(value)) {
        facets.push({ propertyKey, subpropertyKey: subKey as SubPropertyKey })
      }
      continue
    }

    facets.push({ propertyKey })
  }

  return facets
}

function slicesMatch(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

function deleteFacet(overrides: Properties, facet: TouchedFacet): void {
  const bag = overrides as Record<string, unknown>
  const { propertyKey, subpropertyKey, layerIndex = 0 } = facet

  if (!subpropertyKey) {
    delete bag[propertyKey]
    return
  }

  const overrideBag = bag[propertyKey]
  if (Array.isArray(overrideBag)) {
    const layer = overrideBag[layerIndex]
    if (layer && typeof layer === "object") {
      delete (layer as Record<string, unknown>)[subpropertyKey]
    }
  } else if (
    overrideBag &&
    typeof overrideBag === "object" &&
    !("type" in (overrideBag as Record<string, unknown>))
  ) {
    delete (overrideBag as Record<string, unknown>)[subpropertyKey]
  }
}

/**
 * Drops a property whose override bag no longer carries any facet. A compound or
 * shorthand bag is dropped when it has no remaining keys. A layered-paint stack
 * is dropped only when every layer slot is empty, so a stack that still adds a
 * real layer keeps its length and sibling layers.
 */
function dropEmptyOverride(overrides: Properties, key: PropertyKey): void {
  const bag = overrides as Record<string, unknown>
  const value = bag[key]
  if (value === undefined) return

  if (Array.isArray(value)) {
    const allEmpty = value.every(
      (layer) =>
        !layer ||
        (typeof layer === "object" &&
          Object.keys(layer as Record<string, unknown>).length === 0),
    )
    if (allEmpty) delete bag[key]
    return
  }

  if (
    value &&
    typeof value === "object" &&
    !("type" in (value as Record<string, unknown>)) &&
    Object.keys(value as Record<string, unknown>).length === 0
  ) {
    delete bag[key]
  }
}

/**
 * Removes override facets that match the baseline a node would resolve to
 * without them, so a write that equals the inherited value stays a no-op instead
 * of a stored override. Only facets present in `patch` are considered, leaving
 * untouched overrides in place. Mutates `overrides` directly.
 */
export function pruneRedundantOverrides(
  overrides: Properties,
  patch: Properties,
  baseline: Properties,
): void {
  const touchedKeys = new Set<PropertyKey>()

  for (const facet of enumeratePatchFacets(patch)) {
    touchedKeys.add(facet.propertyKey)

    const overrideSlice = readPropertySlice(
      overrides,
      facet.propertyKey,
      facet.subpropertyKey,
      facet.layerIndex ?? 0,
    )
    if (overrideSlice === undefined) continue

    const baselineSlice = readPropertySlice(
      baseline,
      facet.propertyKey,
      facet.subpropertyKey,
      facet.layerIndex ?? 0,
    )
    if (!slicesMatch(overrideSlice, baselineSlice)) continue

    deleteFacet(overrides, facet)
  }

  for (const key of touchedKeys) {
    dropEmptyOverride(overrides, key)
  }
}
