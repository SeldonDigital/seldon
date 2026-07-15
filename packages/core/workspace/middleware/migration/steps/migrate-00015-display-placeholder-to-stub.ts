import type { Workspace } from "../../../model/workspace"

/**
 * v15: rename the `display` option `placeholder` to `stub`.
 *
 * The `Display` enum value `PLACEHOLDER` is now `STUB`, so a stored `display`
 * cell keyed to `"placeholder"` is an invalid option. This step walks every
 * board `componentProperties`, node `overrides`, and node `states`, and rewrites
 * any `display` cell whose value is `"placeholder"` to `"stub"`, keeping the
 * tagged type. Only `display` cells are touched, so other properties are left
 * alone. Guarded and idempotent, safe to re-run.
 */

/** True when a value is a `display` cell still set to `"placeholder"`. */
function isPlaceholderDisplayCell(cell: unknown): boolean {
  if (!cell || typeof cell !== "object") return false
  return (cell as { value?: unknown }).value === "placeholder"
}

/** True when a value tree holds a `display` cell set to `"placeholder"`. */
function treeNeedsRewrite(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(treeNeedsRewrite)
  }
  if (!value || typeof value !== "object") return false
  const record = value as Record<string, unknown>

  for (const [key, sub] of Object.entries(record)) {
    if (key === "display" && isPlaceholderDisplayCell(sub)) return true
    if (treeNeedsRewrite(sub)) return true
  }

  return false
}

/** Rewrites `display` `"placeholder"` cells to `"stub"`, in place. */
function rewriteTree(value: unknown): void {
  if (Array.isArray(value)) {
    for (const item of value) rewriteTree(item)
    return
  }
  if (!value || typeof value !== "object") return
  const record = value as Record<string, unknown>

  for (const [key, sub] of Object.entries(record)) {
    if (key === "display" && isPlaceholderDisplayCell(sub)) {
      record[key] = { ...(sub as object), value: "stub" }
      continue
    }
    rewriteTree(sub)
  }
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

export function migrateV15DisplayPlaceholderToStub(
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
