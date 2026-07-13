import { joinCompoundFacetKey } from "@seldon/core/properties/schemas/helpers/property-path"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

import {
  isTaggedValue,
  propertyShape,
  themeRefTag,
} from "../prompt/property-taxonomy"

/** One deterministic shape fix applied to a model action before validation. */
export interface ActionRepair {
  actionType: string
  propertyKey: string
  reason: string
}

/** Result of {@link normalizeActions}: repaired actions plus what changed. */
export interface NormalizeResult {
  actions: WorkspaceAction[]
  repairs: ActionRepair[]
}

/** Actions that carry a `properties` map the repair pass can inspect. */
const PROPERTY_ACTION_TYPES = new Set([
  "set_node_properties",
  "set_component_properties",
])

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * Coerces a value written to a layered paint key into the array-of-layers shape
 * the reducer expects. Handles the two shapes models commonly emit:
 * a single layer object, and a flat color value on `background`. Anything else
 * is returned untouched so the reducer can reject it with a precise reason.
 */
function repairLayeredValue(
  key: string,
  value: unknown,
  actionType: string,
  repairs: ActionRepair[],
): unknown {
  if (Array.isArray(value)) return value
  if (!isPlainObject(value)) return value

  if (isTaggedValue(value)) {
    if (key === "background") {
      repairs.push({
        actionType,
        propertyKey: key,
        reason: "wrapped a flat value into a background color layer",
      })
      return [{ kind: { type: "option", value: "color" }, color: value }]
    }
    return value
  }

  repairs.push({
    actionType,
    propertyKey: key,
    reason: "wrapped a single layer object into a layer array",
  })
  return [value]
}

/**
 * Wraps a loose value written to an atomic key into its tagged shape. Models
 * often emit a bare literal (`"WORKS"`, `12`) or a bare theme reference
 * (`"@swatch.primary"`) instead of the `{ type, value }` object the reducer
 * expects. An `@` reference becomes a theme value tagged by its scope, and any
 * other primitive becomes an exact value. Already-tagged values and non-scalar
 * shapes pass through untouched for core validation to handle.
 */
function coerceAtomicValue(
  key: string,
  value: unknown,
  actionType: string,
  repairs: ActionRepair[],
): unknown {
  if (isTaggedValue(value)) return value

  if (typeof value === "string") {
    if (value.startsWith("@")) {
      const tag = themeRefTag(key)
      if (tag) {
        repairs.push({
          actionType,
          propertyKey: key,
          reason: `wrapped "${value}" into a ${tag} theme reference`,
        })
        return { type: tag, value }
      }
    }
    repairs.push({
      actionType,
      propertyKey: key,
      reason: "wrapped a bare string into an exact value",
    })
    return { type: "exact", value }
  }

  if (typeof value === "number" || typeof value === "boolean") {
    repairs.push({
      actionType,
      propertyKey: key,
      reason: `wrapped a bare ${typeof value} into an exact value`,
    })
    return { type: "exact", value }
  }

  return value
}

/**
 * Deterministically repairs common property-shape mistakes in model actions
 * before the reducer validates them. Conservative by design: it only rewrites
 * unambiguous cases and leaves everything else for core validation to reject
 * with a precise message. Never mutates the input actions.
 */
export function normalizeActions(
  actions: readonly WorkspaceAction[],
): NormalizeResult {
  const repairs: ActionRepair[] = []

  const repaired = actions.map((action) => {
    if (!action || !PROPERTY_ACTION_TYPES.has(action.type)) return action

    const payload = (action as { payload?: unknown }).payload
    if (!isPlainObject(payload)) return action

    const properties = payload.properties
    if (!isPlainObject(properties)) return action

    let changed = false
    const nextProperties: Record<string, unknown> = {}
    const dottedFacets: Record<string, Record<string, unknown>> = {}
    for (const [key, value] of Object.entries(properties)) {
      const dotIndex = key.indexOf(".")
      if (dotIndex > 0 && propertyShape(key.slice(0, dotIndex)) !== "atomic") {
        const root = key.slice(0, dotIndex)
        const facet = key.slice(dotIndex + 1)
        const facetSchemaKey =
          propertyShape(root) === "shorthand"
            ? root
            : joinCompoundFacetKey(root, facet)
        const bucket = dottedFacets[root] ?? (dottedFacets[root] = {})
        bucket[facet] = coerceAtomicValue(
          facetSchemaKey,
          value,
          action.type,
          repairs,
        )
        repairs.push({
          actionType: action.type,
          propertyKey: key,
          reason: `nested dotted key into ${root} facet "${facet}"`,
        })
        changed = true
        continue
      }

      const shape = propertyShape(key)
      let next = value
      if (shape === "layered") {
        next = repairLayeredValue(key, value, action.type, repairs)
      } else if (shape === "atomic") {
        next = coerceAtomicValue(key, value, action.type, repairs)
      }
      nextProperties[key] = next
      if (next !== value) changed = true
    }

    for (const [root, facets] of Object.entries(dottedFacets)) {
      const existing = nextProperties[root]
      const merged = isPlainObject(existing)
        ? { ...existing, ...facets }
        : facets
      if (root === "background" && !("kind" in merged) && "color" in merged) {
        merged.kind = { type: "option", value: "color" }
      }
      nextProperties[root] =
        propertyShape(root) === "layered"
          ? repairLayeredValue(root, merged, action.type, repairs)
          : merged
    }

    if (!changed) return action
    return {
      ...action,
      payload: { ...payload, properties: nextProperties },
    } as WorkspaceAction
  })

  return { actions: repaired, repairs }
}
