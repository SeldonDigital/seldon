import { getImmediateParentIdInWorkspace } from "@seldon/core/workspace/helpers/components/get-node-parent-id"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { getPropertyStatus } from "@seldon/core/workspace/helpers/properties/property-status"
import { getEffectiveProperties } from "@seldon/core/workspace/helpers/properties/shared"
import type { Workspace } from "@seldon/core/workspace/types"

import { summarizeValue } from "./value-summary"

/**
 * Color and background carry down the parent chain, so high-contrast and
 * inherited-color reasoning needs the ancestors' paint, not the whole tree.
 * These are the keys worth surfacing per ancestor.
 */
const INHERITED_KEYS = ["color", "background", "opacity"] as const

const MAX_DEPTH = 12

/** One line per ancestor with its identity and any set paint keys. */
function ancestorLine(workspace: Workspace, nodeId: string): string {
  const node = workspace.nodes[nodeId]
  const catalogId = node ? getNodeCatalogId(node, workspace) : undefined
  const kind = node
    ? catalogId
      ? `${node.level} ${catalogId}`
      : node.level
    : "(no node entry)"
  const paint: string[] = []
  try {
    const effective = getEffectiveProperties(nodeId, workspace) as Record<
      string,
      unknown
    >
    const status = getPropertyStatus(nodeId, workspace) as Record<
      string,
      string
    >
    for (const key of INHERITED_KEYS) {
      if (status[key] === "set" || status[key] === "override") {
        paint.push(`${key}=${summarizeValue(effective[key])}`)
      }
    }
  } catch {
    // A non-property-bearing ancestor contributes no paint.
  }
  const paintText = paint.length > 0 ? ` ${paint.join(" ")}` : ""
  return `- ${nodeId} [${kind}]${paintText}`
}

/**
 * Context section: Node ancestry.
 *
 * The parent chain from a node up to its variant root, with each ancestor's set
 * color, background, and opacity. It gives the model what it needs to reason
 * about inherited color and high contrast without widening the editing scope to
 * the whole board. Returns nothing when the id is not a node, so the caller can
 * report a clean miss.
 */
export function ancestrySection(workspace: Workspace, nodeId: string): string[] {
  if (!workspace.nodes[nodeId]) return []

  const chain: string[] = []
  let currentId: string | null = getImmediateParentIdInWorkspace(
    workspace,
    nodeId,
  )
  let depth = 0
  while (currentId && depth < MAX_DEPTH) {
    chain.push(ancestorLine(workspace, currentId))
    currentId = getImmediateParentIdInWorkspace(workspace, currentId)
    depth += 1
  }

  if (chain.length === 0) {
    return [`Ancestry of ${nodeId}: (root, no parents)`]
  }

  return [
    `Ancestry of ${nodeId} (nearest parent first, each with any set color/background/opacity):`,
    ...chain,
  ]
}
