import type { ComputeContext } from "@seldon/core/properties/compute"
import type { WorkspacePropertySource } from "@seldon/core/workspace/compute"
import { getNodeComputeContext } from "@seldon/core/workspace/compute"
import type { EntryNode, Instance, Variant } from "@seldon/core/workspace/types"

/**
 * Builds property compute context for a workspace node (canvas / preview).
 */
export function buildContext(
  node: Variant | Instance | EntryNode,
  workspace: WorkspacePropertySource,
): ComputeContext {
  return getNodeComputeContext(node.id, workspace)
}
