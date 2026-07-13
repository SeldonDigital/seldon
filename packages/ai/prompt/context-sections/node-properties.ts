import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { getPropertyStatus } from "@seldon/core/workspace/helpers/properties/property-status"
import { getEffectiveProperties } from "@seldon/core/workspace/helpers/properties/shared"
import type { Workspace } from "@seldon/core/workspace/types"

import { summarizeValue } from "./value-summary"

/**
 * Context section: Node properties.
 *
 * The effective, merged property values for one node, each tagged with whether
 * it is set on the node, overridden, or inherited from the template. It lets the
 * model read what a value already resolves to instead of re-deriving it from the
 * template and overrides. Returns nothing when the id is not a property-bearing
 * node, so the caller can report a clean miss.
 */
export function nodePropertiesSection(
  workspace: Workspace,
  nodeId: string,
): string[] {
  const node = workspace.nodes[nodeId]
  if (!node) return []

  let effective: Record<string, unknown>
  let status: Record<string, string>
  try {
    effective = getEffectiveProperties(nodeId, workspace) as Record<
      string,
      unknown
    >
    status = getPropertyStatus(nodeId, workspace) as Record<string, string>
  } catch {
    return []
  }

  const keys = Object.keys(effective)
  if (keys.length === 0) return []

  const catalogId = getNodeCatalogId(node, workspace)
  const lines: string[] = [
    `Effective properties for ${nodeId}${catalogId ? ` [${catalogId}]` : ""} (key = value (status)):`,
  ]
  for (const key of keys) {
    lines.push(
      `- ${key} = ${summarizeValue(effective[key])} (${status[key] ?? "inherited"})`,
    )
  }

  return lines
}
