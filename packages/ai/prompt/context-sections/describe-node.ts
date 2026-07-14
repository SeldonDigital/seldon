import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { getChildrenIds } from "@seldon/core/workspace/helpers/components/get-children-ids"
import { getImmediateParentIdInWorkspace } from "@seldon/core/workspace/helpers/components/get-node-parent-id"
import { getSourceNodeId } from "@seldon/core/workspace/helpers/components/get-source-node-id"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { getPropertyStatus } from "@seldon/core/workspace/helpers/properties/property-status"
import { getEffectiveProperties } from "@seldon/core/workspace/helpers/properties/shared"
import type { EntryNode, Workspace } from "@seldon/core/workspace/types"

import { summarizeValue } from "./value-summary"

/** Formats one child node id with its level and resolved catalog id. */
function childLine(nodeId: string, workspace: Workspace): string {
  const node: EntryNode | undefined = workspace.nodes[nodeId]
  if (!node) return `- ${nodeId} (no node entry)`
  const catalogId = getNodeCatalogId(node, workspace)
  const kind = catalogId ? `${node.level} ${catalogId}` : node.level
  const label = node.label ? ` label="${node.label}"` : ""
  return `- ${nodeId} [${kind}]${label}`
}

/**
 * Context section: Describe node.
 *
 * A shallow view of one node so the model can expand only the branch it edits,
 * instead of the whole variant tree. It pairs the node's identity and where it
 * sits with just its immediate children and the properties actually set or
 * overridden, leaving deeper subtrees behind a second describe_node call. Returns
 * nothing when the id is not a node, so the caller can report a clean miss.
 */
export function describeNodeSection(
  workspace: Workspace,
  nodeId: string,
): string[] {
  const node = workspace.nodes[nodeId]
  if (!node) return []

  const catalogId = getNodeCatalogId(node, workspace)
  const label = node.label ? ` label="${node.label}"` : ""
  const lines: string[] = [
    `Node: ${nodeId} [${node.level}]${catalogId ? ` catalogId=${catalogId}` : ""}${label}`,
  ]

  const parentId = getImmediateParentIdInWorkspace(workspace, nodeId)
  lines.push(`Parent: ${parentId ?? "(root)"}`)

  const sourceId = getSourceNodeId(workspace, nodeId)
  if (sourceId !== nodeId) {
    lines.push(
      `Source: ${sourceId} (set_properties with scope "all" writes here so every instance follows; scope "instance" overrides only this node)`,
    )
  }

  const board = getBoardByNodeId(workspace, nodeId)
  if (board) {
    const childIds = getChildrenIds(board, nodeId)
    if (childIds.length > 0) {
      lines.push("Children (call describe_node on any id to expand it):")
      for (const childId of childIds) {
        lines.push(childLine(childId, workspace))
      }
    } else {
      lines.push("Children: (none)")
    }
  }

  try {
    const effective = getEffectiveProperties(nodeId, workspace)
    const status = getPropertyStatus(nodeId, workspace)
    const keys = Object.keys(effective).filter(
      (key) => status[key] === "set" || status[key] === "override",
    )
    if (keys.length > 0) {
      lines.push("Set properties (key = value (status)):")
      for (const key of keys) {
        const value = (effective as Record<string, unknown>)[key]
        lines.push(`- ${key} = ${summarizeValue(value)} (${status[key]})`)
      }
    }
  } catch {
    // A non-property-bearing node has no property summary to show.
  }

  return lines
}
