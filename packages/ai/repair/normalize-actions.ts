import { getPresetOptions } from "@seldon/core/properties/schemas/helpers/property-options"
import { getCatalogKeyForPropertyPath } from "@seldon/core/properties/schemas/helpers/property-path"
import { resolveToken } from "@seldon/core/rules/config/design-semantics.resolve"
import { computeWorkspaceThemes } from "@seldon/core/workspace/compute"

import { isTaggedValue, themeRefTag } from "../prompt/property-taxonomy"

import type { Theme } from "@seldon/core/themes/types"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

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
  "set_node_state_properties",
])

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * Wraps one loose leaf value into its tagged `{ type, value }` shape, the form
 * the reducer expects. A bare `@` reference becomes a theme value tagged by its
 * scope; a scalar matching one of the property's option keywords becomes an
 * option; any other scalar becomes an exact value. An already-tagged `exact`
 * scalar that matches an option keyword is re-tagged to `option`, so a closed-set
 * property passes option-only validation. `schemaKey` is the flattened key the
 * leaf resolves to. When `resolved` is false the key mapped to no schema, so the
 * exact fallback is flagged as higher-suspicion, since its shape may be wrong.
 * Non-scalar values pass through unchanged.
 */
function coerceLeaf(
  schemaKey: string,
  resolved: boolean,
  value: unknown,
  actionType: string,
  repairs: ActionRepair[],
  theme?: Theme,
): unknown {
  if (isTaggedValue(value)) {
    const tagged = value as { type: unknown; value: unknown }

    if (
      tagged.type === "exact" &&
      (typeof tagged.value === "string" ||
        typeof tagged.value === "number" ||
        typeof tagged.value === "boolean") &&
      getPresetOptions(schemaKey).some((option) => option === tagged.value)
    ) {
      repairs.push({
        actionType,
        propertyKey: schemaKey,
        reason: "re-tagged an exact value into an option value",
      })

      return { ...tagged, type: "option" }
    }

    return value
  }

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

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    if (getPresetOptions(schemaKey).some((option) => option === value)) {
      repairs.push({
        actionType,
        propertyKey: schemaKey,
        reason: `wrapped a bare ${typeof value} into an option value`,
      })

      return { type: "option", value }
    }

    if (typeof value === "string") {
      const token = resolveToken(value, schemaKey, theme)

      if (token) {
        repairs.push({
          actionType,
          propertyKey: schemaKey,
          reason: `resolved "${value}" to the theme token ${token.token}`,
        })

        return { type: token.tag, value: token.token }
      }
    }

    repairs.push({
      actionType,
      propertyKey: schemaKey,
      reason: resolved
        ? `wrapped a bare ${typeof value} into an exact value`
        : `could not resolve a schema key for "${schemaKey}"; wrapped a bare ${typeof value} into an exact value, which may be the wrong shape`,
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
  theme?: Theme,
): unknown {
  if (Array.isArray(value)) {
    return value.map((item, index) =>
      coerceTree(`${path}.${index}`, item, actionType, repairs, theme),
    )
  }

  if (isPlainObject(value) && !isTaggedValue(value)) {
    const out: Record<string, unknown> = {}

    for (const [facet, facetValue] of Object.entries(value)) {
      out[facet] = coerceTree(`${path}.${facet}`, facetValue, actionType, repairs, theme)
    }

    return out
  }

  const resolvedKey = getCatalogKeyForPropertyPath(path)

  return coerceLeaf(
    resolvedKey ?? path,
    resolvedKey !== undefined,
    value,
    actionType,
    repairs,
    theme,
  )
}

/**
 * Writes a value at a dot path, building nested objects (and an array where the
 * next segment is an index) and merging into an existing plain object rather than
 * replacing it. This turns a dotted key such as `font.style` into the nested
 * `{ font: { style } }` the reducer stores, and folds sibling facets together.
 */
function assignPath(target: Record<string, unknown>, segments: string[], value: unknown): void {
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

  cursor[last] = isPlainObject(existing) && isPlainObject(value) ? { ...existing, ...value } : value
}

/**
 * Deterministically repairs the property shape of model actions before the
 * reducer validates them. It rebuilds each `properties` map so a dotted key
 * becomes a nested facet, and every leaf value is tagged, using one recursive
 * walk keyed off the core path resolver. When a `workspace` is passed, a bare
 * descriptive word on a themeable key resolves to a real theme token, so "big"
 * becomes `@fontSize.xxlarge` rather than an invalid exact value. Anything it
 * cannot place is left for core validation to reject with a precise message.
 * Never mutates the input.
 */
export function normalizeActions(
  actions: readonly WorkspaceAction[],
  workspace?: Workspace,
): NormalizeResult {
  const repairs: ActionRepair[] = []

  // Theme computation can throw on a malformed workspace, so a failure drops
  // token resolution rather than the whole repair pass.
  let theme: Theme | undefined

  if (workspace) {
    try {
      theme = computeWorkspaceThemes(workspace)[0] as unknown as Theme | undefined
    } catch {
      theme = undefined
    }
  }

  const repaired = actions.map((action) => {
    if (!action || !PROPERTY_ACTION_TYPES.has(action.type)) return action

    const payload = (action as { payload?: unknown }).payload

    if (!isPlainObject(payload)) return action

    const properties = payload.properties

    if (!isPlainObject(properties)) return action

    const nextProperties: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(properties)) {
      const coerced = coerceTree(key, value, action.type, repairs, theme)
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
