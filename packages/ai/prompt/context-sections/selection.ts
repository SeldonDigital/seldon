import { getChildrenIds } from "@seldon/core/workspace/helpers/components/get-children-ids"
import { getImmediateParentIdInWorkspace } from "@seldon/core/workspace/helpers/components/get-node-parent-id"
import { getSourceNodeId } from "@seldon/core/workspace/helpers/components/get-source-node-id"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { getPropertyStatus } from "@seldon/core/workspace/helpers/properties/property-status"
import { getEffectiveProperties } from "@seldon/core/workspace/helpers/properties/shared"
import type { Board, Workspace } from "@seldon/core/workspace/types"

/**
 * Property values are tagged unions and can be verbose. The selection summary is
 * a reading aid, not a wire format, so this collapses a value to a short
 * `type:value` and caps raw JSON length. Fidelity here is not the goal; the
 * model rewrites values from the shapes section, not by copying this string.
 */
function summarizeValue(value: unknown): string {
  if (value && typeof value === "object" && "type" in value) {
    const tagged = value as { type?: unknown; value?: unknown }
    return `${String(tagged.type)}:${JSON.stringify(tagged.value)}`
  }
  const json = JSON.stringify(value)
  return json.length > 80 ? `${json.slice(0, 80)}…` : json
}

/**
 * Context section: Selected node.
 *
 * A user who says "change this" means the node selected on the canvas, which the
 * board tree alone cannot convey. This foregrounds that node as the primary
 * target: its identity, where it sits, and the properties actually set or
 * overridden with their status, so the model edits the selection instead of
 * guessing from the request. It returns nothing when there is no selection, so
 * the section simply drops out of the context.
 *
 * Property-bearing lookups can throw for a non-property node, so a failed lookup
 * drops the property summary rather than the whole section.
 */
export function selectionSection(
  workspace: Workspace,
  board: Board | undefined,
  selectedNodeId: string | undefined,
  selectedNodeRootId: string | undefined,
): string[] {
  if (!selectedNodeId) return []
  const node = workspace.nodes[selectedNodeId]
  if (!node) return []

  const lines: string[] = [""]
  const catalogId = getNodeCatalogId(node, workspace)
  const label = node.label ? ` label="${node.label}"` : ""
  lines.push(
    `Selected node: ${selectedNodeId} [${node.level}]${catalogId ? ` catalogId=${catalogId}` : ""}${label}`,
  )
  if (selectedNodeRootId) {
    lines.push(`Selected in variant column: ${selectedNodeRootId}`)
  }

  const parentId = getImmediateParentIdInWorkspace(workspace, selectedNodeId)
  lines.push(`Parent: ${parentId ?? "(root)"}`)

  const sourceId = getSourceNodeId(workspace, selectedNodeId)
  if (sourceId !== selectedNodeId) {
    lines.push(
      `Source: ${sourceId} (set_properties with scope "all" writes here so every instance follows; scope "instance" overrides only this node)`,
    )
  }

  if (board) {
    const childIds = getChildrenIds(board, selectedNodeId)
    if (childIds.length > 0) {
      lines.push(`Children: ${childIds.join(", ")}`)
    }
  }

  try {
    const effective = getEffectiveProperties(selectedNodeId, workspace)
    const status = getPropertyStatus(selectedNodeId, workspace)
    const keys = Object.keys(effective).filter(
      (key) => status[key] === "set" || status[key] === "override",
    )
    if (keys.length > 0) {
      lines.push("Current properties (key = value (status)):")
      for (const key of keys) {
        const value = (effective as Record<string, unknown>)[key]
        lines.push(`- ${key} = ${summarizeValue(value)} (${status[key]})`)
      }
    }
  } catch {
    // A non-property-bearing selection has no property summary to show.
  }

  return lines
}
