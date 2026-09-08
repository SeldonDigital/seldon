import { isEmptyValue } from "../../helpers/type-guards/value/is-empty-value"
import { isInheritValue } from "../../helpers/type-guards/value/is-inherit-value"
import { findInObject } from "../../helpers/utils/find-in-object"

import type { Value } from "../types/value"
import type { ComputeContext } from "./types"

export interface InheritSource {
  value: Value
  source: ComputeContext
}

function isFacetMap(value: unknown): value is Record<string, Value> {
  return !!value && typeof value === "object" && !Array.isArray(value) && !("type" in value)
}

function isContributingValue(value: unknown): value is Value {
  if (!value || typeof value !== "object" || !("type" in value)) {
    return false
  }

  return !isEmptyValue(value as Value) && !isInheritValue(value as Value)
}

/**
 * Walks parent contexts for `path` and returns the first contributing value.
 * Skips missing, EMPTY, and INHERIT cells. Does not persist the result.
 */
export function resolveInheritSource(path: string, context: ComputeContext): InheritSource | null {
  let cursor = context.parentContext

  while (cursor) {
    const value = findInObject<Value>(cursor.properties, path)

    if (isContributingValue(value)) {
      return { value, source: cursor }
    }

    cursor = cursor.parentContext
  }

  return null
}

function findParentLookCompound(
  propertyKey: string,
  context: ComputeContext,
): Record<string, Value> | null {
  let cursor = context.parentContext

  while (cursor) {
    const raw = (cursor.properties as Record<string, unknown>)[propertyKey]

    if (isFacetMap(raw)) {
      if (isInheritValue(raw.preset)) {
        cursor = cursor.parentContext
        continue
      }

      if (Object.values(raw).some((value) => isContributingValue(value))) {
        return { ...raw }
      }
    }

    cursor = cursor.parentContext
  }

  return null
}

/**
 * Copies the nearest parent look compound, then overlays the child's authored
 * facets. An INHERIT preset is not written back. Child EMPTY and INHERIT
 * facets keep the inherited values.
 */
export function inheritLookCompound(
  propertyKey: string,
  child: Record<string, Value>,
  context: ComputeContext,
): Record<string, Value> {
  const inherited = findParentLookCompound(propertyKey, context)

  if (!inherited) return child

  const next: Record<string, Value> = { ...inherited }

  for (const [facet, value] of Object.entries(child)) {
    if (facet === "preset") continue
    if (!value || isEmptyValue(value) || isInheritValue(value)) continue

    next[facet] = value
  }

  return next
}

/**
 * Copies the nearest parent paint layer at `index`, then overlays the child's
 * authored facets. Used when a layer preset is INHERIT.
 */
export function inheritPaintLayer(
  propertyKey: string,
  index: number,
  child: Record<string, Value>,
  context: ComputeContext,
): Record<string, Value> {
  let cursor = context.parentContext

  while (cursor) {
    const stack = (cursor.properties as Record<string, unknown>)[propertyKey]

    if (Array.isArray(stack) && isFacetMap(stack[index])) {
      const parentLayer = stack[index] as Record<string, Value>

      if (isInheritValue(parentLayer.preset)) {
        cursor = cursor.parentContext
        continue
      }

      if (Object.values(parentLayer).some((value) => isContributingValue(value))) {
        const next: Record<string, Value> = { ...parentLayer }

        for (const [facet, value] of Object.entries(child)) {
          if (facet === "preset") continue
          if (!value || isEmptyValue(value) || isInheritValue(value)) continue

          next[facet] = value
        }

        return next
      }
    }

    cursor = cursor.parentContext
  }

  return child
}
