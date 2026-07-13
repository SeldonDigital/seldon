import { getPropertyStatus } from "@seldon/core/workspace/helpers/properties/property-status"
import { getEffectiveProperties } from "@seldon/core/workspace/helpers/properties/shared"
import type { Workspace } from "@seldon/core/workspace/types"

/** One string leaf found in a node's set properties, keyed by its dotted path. */
export interface NodeString {
  path: string
  text: string
}

const MAX_STRINGS = 6
const MAX_LENGTH = 40

/** Trims a value to a bounded, single-line preview for display and matching. */
function truncate(text: string): string {
  const flat = text.replace(/\s+/g, " ").trim()
  return flat.length > MAX_LENGTH ? `${flat.slice(0, MAX_LENGTH)}…` : flat
}

/**
 * Walks a tagged property value and records every string leaf it reaches. A
 * value may be a bare string, a tagged `{ type, value }`, a compound object of
 * tagged sub-values, or an array of layers, so this recurses through objects and
 * arrays and unwraps a tagged `value` when that value is itself a string. The
 * dotted path names where the string sits, such as `background.0.color`.
 */
function walkValue(value: unknown, path: string, out: NodeString[]): void {
  if (out.length >= MAX_STRINGS) return
  if (typeof value === "string") {
    if (value.trim() !== "") out.push({ path, text: truncate(value) })
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkValue(item, `${path}.${index}`, out))
    return
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>
    if ("value" in record) {
      walkValue(record.value, path, out)
      return
    }
    for (const [key, child] of Object.entries(record)) {
      walkValue(child, path ? `${path}.${key}` : key, out)
    }
  }
}

/**
 * The string leaves of a node's set or overridden properties. A user often
 * names a node by what it shows or by a value it carries, such as a heading's
 * text, a theme ref like `@swatch.primary`, or an exact color like
 * `hsl(202 50% 95%)`. Surfacing those strings lets the model match the request
 * to an id without expanding the node first. Returns an empty list for a node
 * with no property view.
 */
export function collectNodeStrings(
  workspace: Workspace,
  nodeId: string,
): NodeString[] {
  try {
    const effective = getEffectiveProperties(nodeId, workspace) as Record<
      string,
      unknown
    >
    const status = getPropertyStatus(nodeId, workspace)
    const out: NodeString[] = []
    for (const key of Object.keys(effective)) {
      if (status[key] !== "set" && status[key] !== "override") continue
      walkValue(effective[key], key, out)
      if (out.length >= MAX_STRINGS) break
    }
    return out
  } catch {
    return []
  }
}

/** A compact `path=text` summary of a node's string leaves, or "" when none. */
export function nodeStringsSummary(
  workspace: Workspace,
  nodeId: string,
): string {
  const strings = collectNodeStrings(workspace, nodeId)
  if (strings.length === 0) return ""
  return strings.map(({ path, text }) => `${path}="${text}"`).join(", ")
}

/**
 * The first string leaf on a node that contains the needle, or null. Callers
 * pass a lowercased needle and use the returned snippet to explain why a node
 * matched a query by value rather than by label or catalog id.
 */
export function matchNodeStrings(
  workspace: Workspace,
  nodeId: string,
  needle: string,
): string | null {
  for (const { text } of collectNodeStrings(workspace, nodeId)) {
    if (text.toLowerCase().includes(needle)) return text
  }
  return null
}
