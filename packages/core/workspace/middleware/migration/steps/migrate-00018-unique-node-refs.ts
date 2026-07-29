import type { Workspace } from "../../../model/workspace"

/**
 * v18: drop a `ref` that another node already claims.
 *
 * A ref must stay unique across the workspace, because generated code targets a
 * node by that name alone. A stored file can still hold two nodes with the same
 * ref, from an import, a hand edit, or a copy written by an older build, and
 * verification refuses to open it. The first node to claim a ref keeps it and
 * every later node loses it, matching the export registry, which keeps the first
 * and ignores the rest. Guarded and idempotent, safe to re-run.
 */

/** Ref as uniqueness compares it, or null when the node carries none. */
function refKey(node: { ref?: string }): string | null {
  const trimmed = node.ref?.trim()

  return trimmed ? trimmed : null
}

function migrationApplies(workspace: Workspace): boolean {
  const seen = new Set<string>()

  for (const node of Object.values(workspace.nodes)) {
    const ref = refKey(node)

    if (!ref) continue

    if (seen.has(ref)) return true
    seen.add(ref)
  }

  return false
}

export function migrateV18UniqueNodeRefs(workspace: Workspace): Workspace {
  if (!migrationApplies(workspace)) return workspace

  const next = structuredClone(workspace)
  const seen = new Set<string>()

  for (const node of Object.values(next.nodes)) {
    const ref = refKey(node)

    if (!ref) continue

    if (seen.has(ref)) delete node.ref
    else seen.add(ref)
  }

  return next
}
