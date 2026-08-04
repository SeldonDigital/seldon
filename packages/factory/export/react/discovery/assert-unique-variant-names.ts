import { getDuplicateVariantLabelNodeIds } from "@seldon/core/workspace/helpers/components/duplicate-variant-labels"
import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"

import type { Workspace } from "@seldon/core"

/**
 * Error thrown when a workspace cannot be exported because two variants on the
 * same board share a label. The editor surfaces this to the user and blocks
 * the export instead of writing colliding component files.
 */
export class DuplicateVariantNameError extends Error {
  readonly nodeIds: string[]

  constructor(message: string, nodeIds: string[]) {
    super(message)
    this.name = "DuplicateVariantNameError"
    this.nodeIds = nodeIds
  }
}

/**
 * Rejects export when any board has duplicate variant labels. Two variants that
 * share a label resolve to the same component name and output path, so one
 * would silently overwrite the other. Rename the flagged variants first.
 *
 * Pass `emittedVariantIds` to scope the check to the variants the export
 * actually emits, so a pruned mock or exclude variant cannot block export.
 */
export function assertUniqueVariantNames(
  workspace: Workspace,
  emittedVariantIds?: Set<string>,
): void {
  const duplicateIds = getDuplicateVariantLabelNodeIds(
    workspace,
    emittedVariantIds ? (nodeId) => emittedVariantIds.has(nodeId) : undefined,
  )

  if (duplicateIds.size === 0) return

  const details = [...duplicateIds].map((nodeId) => {
    const label = workspace.nodes[nodeId]?.label ?? nodeId
    const boardLabel = getBoardByNodeId(workspace, nodeId)?.label ?? "unknown"

    return `"${label}" on ${boardLabel}`
  })

  throw new DuplicateVariantNameError(
    `Cannot export: ${duplicateIds.size} variant name conflict(s). Rename these so each variant is unique on its board: ${details.join(", ")}.`,
    [...duplicateIds],
  )
}
