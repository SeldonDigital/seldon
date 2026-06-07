import { getComponentSchema } from "../../../../components/catalog"
import { isComponentId } from "../../../../components/constants"
import type { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import { getNodeCatalogId } from "../../../helpers/nodes/get-node-catalog-id"
import { isEntryNodeForRules } from "../../../helpers/rules/rules-node-subject"
import type { EntryNode } from "../../../model/entry-node"
import { isEntryNodeVariant } from "../../../model/entry-node"
import { parseNodeLink } from "../../../model/template-ref"
import {
  nodeRetrievalService,
  workspaceMutationService,
  workspacePropagationService,
  typeCheckingService,
} from "../../../services"

function defaultLabelForNode(node: EntryNode, workspace: Workspace): string {
  if (isEntryNodeVariant(node)) return "Custom"
  const linkedTemplate = parseNodeLink(node.template)
  if (linkedTemplate?.kind === "node") {
    const templateNode = workspace.nodes[linkedTemplate.nodeId]
    if (templateNode?.label) {
      return templateNode.label
    }
  }
  const catalogId = getNodeCatalogId(node, workspace)
  if (catalogId && isComponentId(catalogId)) {
    try {
      return getComponentSchema(catalogId).name
    } catch {
      return node.label
    }
  }
  return node.label
}

export function resetNodeLabel(
  payload: ExtractPayload<"reset_node_label">,
  workspace: Workspace,
): Workspace {
  const node = nodeRetrievalService.getNode(payload.nodeId, workspace)
  if (!isEntryNodeForRules(node)) {
    return workspace
  }
  const entityType = typeCheckingService.getEntityType(node)
  const { allowed, propagation } = rules.mutations.rename[entityType]
  if (!allowed) {
    return workspace
  }
  return workspacePropagationService.propagateNodeOperation({
    nodeId: payload.nodeId,
    propagation,
    apply: (n, w) =>
      workspaceMutationService.setNodeLabel(
        n.id,
        defaultLabelForNode(n as EntryNode, w),
        w,
      ),
    workspace,
  })
}
