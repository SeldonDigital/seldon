import { getPropertyCategory } from "@seldon/core/properties/schemas/helpers"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"
import { changedProperties, isTaggedValue, targetIdOf } from "./action-helpers"
import type { ApplyReport } from "./apply-report"
import { targetPath } from "./target-path"

/** Compact serialization of a tagged property value, e.g. `@swatch.primary` or `8px`. */
function summarizeValue(value: unknown): string {
  if (value && typeof value === "object" && "value" in value) {
    const inner = (value as { value?: unknown }).value
    if (inner && typeof inner === "object" && "value" in (inner as object)) {
      const length = inner as { value?: unknown; unit?: unknown }
      if (typeof length.value === "number") {
        return `${length.value}${typeof length.unit === "string" ? length.unit : ""}`
      }
    }
    if (typeof inner === "string" || typeof inner === "number") {
      return String(inner)
    }
    return JSON.stringify(inner)
  }
  return typeof value === "string" ? value : JSON.stringify(value)
}

/** One `key[i].facet: value` line per facet across a layered paint value. */
function flattenLayers(key: string, layers: unknown[]): string[] {
  return layers.flatMap((layer, index) => {
    if (!layer || typeof layer !== "object") return []
    const prefix = layers.length > 1 ? `${key}[${index}]` : key
    return Object.entries(layer as Record<string, unknown>).map(
      ([facet, facetValue]) =>
        `${prefix}.${facet}: ${summarizeValue(facetValue)}`,
    )
  })
}

/** One line per sub-value of a compound or shorthand property. */
function flattenCompound(
  key: string,
  value: Record<string, unknown>,
): string[] {
  const shorthand = getPropertyCategory(key) === "shorthand"
  return Object.entries(value).map(([sub, subValue]) =>
    shorthand
      ? `${key}: ${sub}: ${summarizeValue(subValue)}`
      : `${key}.${sub}: ${summarizeValue(subValue)}`,
  )
}

/**
 * Flattens one property entry to `label: value` strings that match how the facet
 * is shaped: a compound facet reads `font.style: italic`, a shorthand side reads
 * `padding: top: value`, a layered facet reads `background.color: value`, and an
 * atomic value reads `key: value`.
 */
function flattenChange(key: string, value: unknown): string[] {
  if (Array.isArray(value)) return flattenLayers(key, value)
  if (value && typeof value === "object" && !isTaggedValue(value)) {
    return flattenCompound(key, value as Record<string, unknown>)
  }
  return [`${key}: ${summarizeValue(value)}`]
}

/** Groups applied actions by their target id, preserving insertion order. */
function groupByTarget(
  actions: WorkspaceAction[],
): Map<string, WorkspaceAction[]> {
  const groups = new Map<string, WorkspaceAction[]>()
  for (const action of actions) {
    const id = targetIdOf(action.payload) ?? ""
    const list = groups.get(id) ?? []
    list.push(action)
    groups.set(id, list)
  }
  return groups
}

/** The `key: value` strings one action contributes, or its type when it sets none. */
function actionChanges(action: WorkspaceAction): string[] {
  const props = changedProperties(action)
  if (props.length === 0) return [action.type]
  return props.flatMap(([key, value]) => flattenChange(key, value))
}

/** The path line and the comma-joined changes line for one target group. */
function describeGroup(
  workspace: Workspace,
  id: string,
  actions: WorkspaceAction[],
): string[] {
  const changes = actions.flatMap(actionChanges)
  return [targetPath(workspace, id || undefined), changes.join(", ")]
}

/**
 * Builds the outcome block: for each target that changed, one line with its
 * ancestry path, then one line listing every property and value touched on it,
 * comma separated. Actions to the same target merge into one entry, and an
 * action with no property map lists its action type instead. Groups are
 * separated by a blank line so each target reads as its own block.
 */
export function describeChanges(
  workspace: Workspace,
  report: ApplyReport,
): string[] {
  const rows: string[] = []
  for (const [id, actions] of groupByTarget(report.appliedActions)) {
    if (rows.length > 0) rows.push("")
    rows.push(...describeGroup(workspace, id, actions))
  }
  return rows
}
