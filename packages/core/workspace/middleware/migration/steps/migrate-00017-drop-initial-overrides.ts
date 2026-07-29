import type { Workspace } from "../../../model/workspace"

/**
 * v17: drop `__editor.initialOverrides` from every node.
 *
 * The field held a snapshot of a node's overrides at creation time. Nothing read
 * it, and on a large file it was the single biggest field, often a byte-identical
 * copy of `overrides`. This step removes it and drops `__editor` when nothing
 * else remains, so a node keeping other editor state such as `repeat` is left
 * with that state intact. Guarded and idempotent, safe to re-run.
 */

/** True when a node carries the removed key. */
function nodeNeedsRewrite(node: { __editor?: Record<string, unknown> }): boolean {
  return node.__editor !== undefined && "initialOverrides" in node.__editor
}

/** Removes the key, clearing `__editor` when it holds nothing else. */
function rewriteNode(node: { __editor?: Record<string, unknown> }): void {
  if (!node.__editor) return

  delete node.__editor.initialOverrides
  if (Object.keys(node.__editor).length === 0) delete node.__editor
}

function migrationApplies(workspace: Workspace): boolean {
  return Object.values(workspace.nodes).some(nodeNeedsRewrite)
}

export function migrateV17DropInitialOverrides(workspace: Workspace): Workspace {
  if (!migrationApplies(workspace)) return workspace

  const next = structuredClone(workspace)

  for (const node of Object.values(next.nodes)) {
    rewriteNode(node)
  }

  return next
}
