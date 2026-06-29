import { isEntryNodeInstance } from "../../model/entry-node"
import { parseNodeLink } from "../../model/template-ref"
import type { EntryNodeId, Workspace } from "../../types"
import { applyResetInstanceToSource } from "./apply-reset-instance-to-source"

/**
 * Resets every direct instance of a variant back to that variant. A direct
 * instance is an instance node whose template links straight to `variantRootId`.
 * Each matched instance is reset to its source with
 * {@link applyResetInstanceToSource}, so its subtree clears overrides and repoints
 * to the variant's matching children. Instances that derive from the variant
 * only through an intermediate instance are left untouched.
 */
export function applyResetVariantInstances(
  workspace: Workspace,
  variantRootId: EntryNodeId,
): Workspace {
  const directInstanceIds = Object.values(workspace.nodes)
    .filter((node) => {
      if (!isEntryNodeInstance(node)) return false
      return parseNodeLink(node.template)?.nodeId === variantRootId
    })
    .map((node) => node.id)

  return directInstanceIds.reduce(
    (current, instanceId) => applyResetInstanceToSource(current, instanceId),
    workspace,
  )
}
