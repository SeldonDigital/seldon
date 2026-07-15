import { getSourceNodeId } from "@seldon/core/workspace/helpers/components/get-source-node-id"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import type { Workspace } from "@seldon/core/workspace/types"

import { nodeStringsSummary } from "./node-strings"

/**
 * The descriptive tail for a node id, everything a tree line prints after the id
 * itself: `[level catalogId type]`, an optional `label=`, its state keys, the
 * source id and label a scope-all edit writes, and a compact preview of its
 * string values. It lets a node be told apart by role, such as a title-variant
 * text node against a label-variant one that shares the same catalog id.
 *
 * A caller prepends its own indent and id, so the active-board tree and a create
 * tool's created-subtree summary render the same node identically. Returns
 * ` (no node entry)` when the id resolves to no node.
 */
export function nodeSummaryTail(workspace: Workspace, id: string): string {
  const node = workspace.nodes[id]
  if (!node) return " (no node entry)"
  const catalogId = getNodeCatalogId(node, workspace)
  const kind = catalogId
    ? `${node.level} ${catalogId} ${node.type}`
    : `${node.level} ${node.type}`
  const label = node.label ? ` label="${node.label}"` : ""
  const stateKeys = node.states ? Object.keys(node.states) : []
  const states = stateKeys.length > 0 ? ` states=[${stateKeys.join(", ")}]` : ""
  const sourceId = getSourceNodeId(workspace, id)
  const sourceLabel = workspace.nodes[sourceId]?.label
  const source =
    sourceId !== id
      ? ` src=${sourceId}${sourceLabel ? ` "${sourceLabel}"` : ""}`
      : ""
  const summary = nodeStringsSummary(workspace, id)
  const values = summary ? ` {${summary}}` : ""
  return ` [${kind}]${label}${states}${source}${values}`
}
