import { Tool } from "@lib/hooks/use-tool"
import { Placement } from "@lib/types"
import { Workspace } from "@seldon/core"
import { InstanceId, VariantId } from "@seldon/core/index"
import { isInsertionAllowed } from "@lib/workspace/is-insertion-allowed"

/**
 * Checks if insertion is allowed for a given object, placement, and tool.
 * Boards always allow insertion. For nodes, delegates to `isInsertionAllowed`.
 *
 * @param objectId - The ID of the object (node or board)
 * @param objectType - The type of object ("node" or "board")
 * @param placement - The placement position ("before", "after", or "inside")
 * @param workspace - The workspace context
 * @param tool - The active tool
 * @returns `true` if insertion is allowed, `false` otherwise
 */
export function checkInsertionPoint(
  objectId: InstanceId | VariantId | string,
  objectType: "node" | "board",
  placement: Placement,
  workspace: Workspace,
  tool: Tool,
): boolean {
  if (objectType === "board") {
    return true
  }

  // Check if node exists in workspace (virtual nodes like categories don't exist)
  if (!workspace.nodes[objectId as InstanceId | VariantId]) {
    return false
  }

  try {
    return isInsertionAllowed(
      objectId as InstanceId | VariantId,
      placement,
      workspace,
      tool,
    )
  } catch (error) {
    // Node doesn't exist in workspace (virtual node), insertion not allowed
    return false
  }
}
