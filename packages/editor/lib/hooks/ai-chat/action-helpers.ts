import type { WorkspaceAction } from "@seldon/core/workspace/types"

/** The payload keys that name an action's primary target, in priority order. */
const TARGET_ID_KEYS = ["nodeId", "instanceId", "variantId", "boardKey"] as const

/** Resolves the primary target id from an action payload. */
export function targetIdOf(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined
  const bag = payload as Record<string, unknown>
  for (const key of TARGET_ID_KEYS) {
    if (typeof bag[key] === "string") return bag[key] as string
  }
  return undefined
}

/**
 * Like {@link targetIdOf}, but falls back to a nested `target.parentId` for
 * insert-style actions that name where they act by their parent rather than by
 * their own id. Used by the console logger so those actions still resolve a
 * target to describe.
 */
export function targetIdWithParentOf(payload: unknown): string | undefined {
  const direct = targetIdOf(payload)
  if (direct) return direct
  if (!payload || typeof payload !== "object") return undefined
  const target = (payload as Record<string, unknown>).target
  if (target && typeof target === "object") {
    const parentId = (target as Record<string, unknown>).parentId
    if (typeof parentId === "string") return parentId
  }
  return undefined
}

/** The property key/value pairs an action sets, if any. */
export function changedProperties(action: WorkspaceAction): [string, unknown][] {
  const payload = (action as { payload?: unknown }).payload
  if (!payload || typeof payload !== "object") return []
  const properties = (payload as Record<string, unknown>).properties
  if (!properties || typeof properties !== "object") return []
  return Object.entries(properties as Record<string, unknown>)
}

/** True for a single tagged value `{ type, value }` rather than a facet/side map. */
export function isTaggedValue(value: unknown): boolean {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "type" in (value as object)
  )
}
