import type { WorkspaceAction } from "@seldon/core/workspace/types"

import { isTaggedValue, propertyShape } from "../prompt/property-taxonomy"

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
    for (const [key, value] of Object.entries(properties)) {
      if (propertyShape(key) === "layered") {
        const next = repairLayeredValue(key, value, action.type, repairs)
        nextProperties[key] = next
        if (next !== value) changed = true
      } else {
        nextProperties[key] = value
      }
    }

    if (!changed) return action
    return {
      ...action,
      payload: { ...payload, properties: nextProperties },
    } as WorkspaceAction
  })

  return { actions: repaired, repairs }
}
