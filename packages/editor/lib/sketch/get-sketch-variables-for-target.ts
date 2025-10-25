import { SketchTask } from "@lib/api/types"
import { ComponentId, isComponentId } from "@seldon/core/components/constants"
import { InstanceId, VariantId, Workspace } from "@seldon/core/index"
import { getNodeProperties } from "@seldon/core/workspace/helpers/get-node-properties"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { Target } from "@lib/hooks/use-target"

export function getSketchVariablesForTarget(
  target: Target,
  workspace: Workspace,
) {
  // User clicked on a board (between variants) so he means to draw a new variant
  if (isComponentId(target.nodeId)) {
    return {
      component: target.nodeId,
      targetNode: target.nodeId,
      targetIndex: target.index,
      task: "add_variant",
    } as const
  }

  // User clicked on a variant or an instance.
  // We find the parent board (for variant) or node (for instance) and the index
  const task = getSketchTaskForObject(target.nodeId, workspace)
  const node = workspaceService.getNode(target.nodeId, workspace)

  return {
    component: node.component,
    subjectNode: node.id,
    task,
  } as const
}

export function getSketchTaskForObject(
  objectId: ComponentId | VariantId | InstanceId,
  workspace: Workspace,
): SketchTask {
  if (isComponentId(objectId)) {
    // Check if the component already has a default variant
    const component = workspace.boards[objectId]
    if (component && component.variants.length > 0) {
      // Component exists with variants, so we want to modify the existing default variant
      return "replace_node"
    }
    // Component doesn't exist yet, so we want to add a new variant
    return "add_variant"
  }

  const node = workspaceService.getNode(objectId, workspace)
  const properties = getNodeProperties(node, workspace)

  if (properties.source?.value || properties.background?.image) {
    return "sketch_image"
  }

  return "replace_node"
}
