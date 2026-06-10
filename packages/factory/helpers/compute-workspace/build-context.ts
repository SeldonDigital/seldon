import type { ComputeContext } from "@seldon/core/properties/compute"
import type { WorkspacePropertySource } from "@seldon/core/workspace/compute"
import { getNodeComputeContext } from "@seldon/core/workspace/compute"
import type { EntryNode, Instance, Variant } from "@seldon/core/workspace/types"

/**
 * Builds property compute context for a workspace node (canvas / preview).
 *
 * `parentIndex` supplies child to parent edges for this render position. When
 * omitted, `getNodeComputeContext` falls back to the global first-parent-wins
 * index. The editor passes per-render edges so a shared child resolves
 * `#parent.*` against the parent it is drawn under.
 */
export function buildContext(
  node: Variant | Instance | EntryNode,
  workspace: WorkspacePropertySource,
  parentIndex?: ReadonlyMap<string, string>,
): ComputeContext {
  return getNodeComputeContext(node.id, workspace, { parentIndex })
}
