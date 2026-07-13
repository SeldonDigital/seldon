import { getPresetOptions } from "@seldon/core/properties/schemas/helpers/property-options"
import { getCatalogKeyForPropertyPath } from "@seldon/core/properties/schemas/helpers/property-path"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

import { isTaggedValue, themeRefTag } from "../prompt/property-taxonomy"

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
 * Wraps one loose leaf value into its tagged shape. Models often emit a bare
 * literal (`"italic"`, `12`) or a bare theme reference (`"@swatch.primary"`)
 * instead of the `{ type, value }` object the reducer expects. An `@` reference
 * becomes a theme value tagged by its scope; a bare value matching one of the
 * property's option keywords becomes an option, so a keyword like `"italic"` is
 * stored as the option the editor renders rather than an exact string it flags
 * as invalid; any other primitive becomes an exact value. `schemaKey` is the
 * flattened key the leaf resolves to, so options and theme tags read from the
 * right schema. Already-tagged and non-scalar values pass through untouched.
 */
function coerceLeaf(
  schemaKey: string,
  value: unknown,
  actionType: string,
  repairs: ActionRepair[],
): unknown {
  if (isTaggedValue(value)) return value

  if (typeof value === "string" && value.startsWith("@")) {
    const tag = themeRefTag(schemaKey)
    if (tag) {
      repairs.push({
        actionType,
        propertyKey: schemaKey,
        reason: `wrapped "${value}" into a ${tag} theme reference`,
      })
      return { type: tag, value }
    }
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    if (getPresetOptions(schemaKey).some((option) => option === value)) {
      repairs.push({
        actionType,
        propertyKey: schemaKey,
        reason: `wrapped a bare ${typeof value} into an option value`,
      })
      return { type: "option", value }
    }
    repairs.push({
      actionType,
      propertyKey: schemaKey,
      reason: `wrapped a bare ${typeof value} into an exact value`,
    })
    return { type: "exact", value }
  }

  return value
}

/**
 * Coerces every leaf value in a property tree, walking objects and arrays the
 * same way. Each leaf's schema key comes from its dot path, so a compound facet,
 * a shorthand side, and a paint-layer facet all coerce like a top-level atomic
 * value with no per-shape branching. A tagged value is a leaf and stops the walk.
 */
function coerceTree(
  path: string,
  value: unknown,
  actionType: string,
  repairs: ActionRepair[],
): unknown {
  if (Array.isArray(value)) {
    return value.map((item, index) =>
      coerceTree(`${path}.${index}`, item, actionType, repairs),
    )
  }
  if (isPlainObject(value) && !isTaggedValue(value)) {
    const out: Record<string, unknown> = {}
    for (const [facet, facetValue] of Object.entries(value)) {
      out[facet] = coerceTree(`${path}.${facet}`, facetValue, actionType, repairs)
    }
    return out
  }
  return coerceLeaf(
    getCatalogKeyForPropertyPath(path) ?? path,
    value,
    actionType,
    repairs,
  )
}

/**
 * Writes a value at a dot path, building nested objects (and an array where the
 * next segment is an index) and merging into an existing plain object rather than
 * replacing it. This turns a dotted key such as `font.style` into the nested
 * `{ font: { style } }` the reducer stores, and folds sibling facets together.
 */
function assignPath(
  target: Record<string, unknown>,
  segments: string[],
  value: unknown,
): void {
  let cursor: Record<string, unknown> = target
  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i]!
    const container = /^\d+$/.test(segments[i + 1]!) ? [] : {}
    if (typeof cursor[segment] !== "object" || cursor[segment] === null) {
      cursor[segment] = container
    }
    cursor = cursor[segment] as Record<string, unknown>
  }
  const last = segments[segments.length - 1]!
  const existing = cursor[last]
  cursor[last] =
    isPlainObject(existing) && isPlainObject(value)
      ? { ...existing, ...value }
      : value
}

/**
 * Deterministically repairs the property shape of model actions before the
 * reducer validates them. It rebuilds each `properties` map so a dotted key
 * becomes a nested facet, and every leaf value is tagged, using one recursive
 * walk keyed off the core path resolver. Anything it cannot place is left for
 * core validation to reject with a precise message. Never mutates the input.
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

    const nextProperties: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(properties)) {
      const coerced = coerceTree(key, value, action.type, repairs)
      const segments = key.split(".")
      if (segments.length > 1) {
        repairs.push({
          actionType: action.type,
          propertyKey: key,
          reason: "reshaped dotted key into a nested facet",
        })
      }
      assignPath(nextProperties, segments, coerced)
    }

    return {
      ...action,
      payload: { ...payload, properties: nextProperties },
    } as WorkspaceAction
  })

  return { actions: repaired, repairs }
}
