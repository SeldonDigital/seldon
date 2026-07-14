import type { Workspace } from "../../../model/workspace"

/**
 * v13: make clip and wrapChildren strictly boolean.
 *
 * The layout `clip` and `wrapChildren` properties no longer accept `empty` or
 * `inherit`; they are On/Off only. Both resolve to their Off behavior when
 * unset, so this step rewrites any stored `empty` or `inherit` cell for those
 * keys to an explicit `exact: false`. This keeps persisted overrides and states
 * valid against the narrowed property model without changing rendering.
 *
 * Guarded and idempotent so it is safe to re-run on files already migrated.
 */

const TARGET_KEYS = ["clip", "wrapChildren"] as const

const EXACT_FALSE = { type: "exact", value: false } as const

/** True when a value is a tagged property cell of the given empty/inherit type. */
function isEmptyOrInheritCell(cell: unknown): boolean {
  if (!cell || typeof cell !== "object") return false
  const type = (cell as { type?: unknown }).type
  return type === "empty" || type === "inherit"
}

/** True when a value tree holds a clip/wrapChildren cell needing a rewrite. */
function treeNeedsRewrite(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(treeNeedsRewrite)
  }
  if (!value || typeof value !== "object") return false
  const record = value as Record<string, unknown>

  for (const key of TARGET_KEYS) {
    if (key in record && isEmptyOrInheritCell(record[key])) {
      return true
    }
  }

  return Object.values(record).some(treeNeedsRewrite)
}

/** Rewrites clip/wrapChildren empty/inherit cells to `exact: false`, in place. */
function rewriteTree(value: unknown): void {
  if (Array.isArray(value)) {
    for (const item of value) rewriteTree(item)
    return
  }
  if (!value || typeof value !== "object") return
  const record = value as Record<string, unknown>

  for (const key of TARGET_KEYS) {
    if (key in record && isEmptyOrInheritCell(record[key])) {
      record[key] = { ...EXACT_FALSE }
    }
  }

  for (const sub of Object.values(record)) rewriteTree(sub)
}

/** True when any board, node, or node state holds a target cell to rewrite. */
function migrationApplies(workspace: Workspace): boolean {
  for (const board of Object.values(workspace.boards)) {
    const componentProperties = (board as { componentProperties?: unknown })
      .componentProperties
    if (componentProperties && treeNeedsRewrite(componentProperties)) {
      return true
    }
  }

  for (const node of Object.values(workspace.nodes)) {
    if (treeNeedsRewrite(node.overrides)) return true
    if (node.states && treeNeedsRewrite(node.states)) return true
  }

  return false
}

export function migrateV13BooleanClipWrapChildren(
  workspace: Workspace,
): Workspace {
  if (!migrationApplies(workspace)) return workspace

  const next = structuredClone(workspace)

  for (const board of Object.values(next.boards)) {
    const componentProperties = (board as { componentProperties?: unknown })
      .componentProperties
    if (componentProperties) rewriteTree(componentProperties)
  }

  for (const node of Object.values(next.nodes)) {
    rewriteTree(node.overrides)
    if (node.states) rewriteTree(node.states)
  }

  return next
}
