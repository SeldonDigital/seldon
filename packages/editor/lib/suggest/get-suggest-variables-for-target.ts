import { SuggestTask } from "@lib/api/types"
import { ComponentId, isComponentId } from "@seldon/core/components/constants"
import { InstanceId, VariantId, Workspace } from "@seldon/core/index"
import { getNodeProperties } from "@seldon/core/workspace/helpers/get-node-properties"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { GetSuggestionVariables } from "@lib/api/hooks/use-get-suggestion"
import { Target } from "@lib/hooks/use-target"

export function getSuggestVariablesForTarget(
  target: Target,
  workspace: Workspace,
): Omit<GetSuggestionVariables, "instructions"> {
  // User clicked on a board (between variants) so he means to draw a new variant
  if (isComponentId(target.nodeId)) {
    return {
      component: target.nodeId,
      targetNode: target.nodeId,
      targetIndex: target.index,
      task: "suggest_variation",
    } as const
  }

  // User clicked on a variant or an instance.
  // We find the parent board (for variant) or node (for instance) and the index
  const task = getSuggestTaskForObject(target.nodeId, workspace)
  const node = workspaceService.getNode(target.nodeId, workspace)
  const properties = getNodeProperties(node, workspace)

  let propertyName: string | undefined = undefined

  if (task) {
    if (task === "suggest_text") {
      if (properties.content?.value) {
        propertyName = "text"
      } else {
        throw new Error("No text property found")
      }
    } else if (task === "suggest_image") {
      if (properties.source?.value) {
        propertyName = "source"
      } else if (properties.background?.image?.value) {
        propertyName = "background.image"
      } else {
        throw new Error("No image property found")
      }
    }
  }
  const isVariant = workspaceService.isVariant(node)

  const targetNode = isVariant
    ? workspaceService.findBoardForVariant(node, workspace)!.id
    : workspaceService.findParentNode(node, workspace)!.id

  const targetIndex = isVariant
    ? workspaceService.getVariantIndex(node, workspace)
    : workspaceService.getInstanceIndex(node, workspace)

  return {
    component: node.component,
    propertyName,
    targetNode,
    targetIndex,
    task: task as SuggestTask,
  } as const
}

export function getSuggestTaskForObject(
  objectId: ComponentId | VariantId | InstanceId,
  workspace: Workspace,
): SuggestTask | null {
  if (isComponentId(objectId)) {
    return "suggest_variation"
  }

  const node = workspaceService.getNode(objectId, workspace)
  const properties = getNodeProperties(node, workspace)

  if (properties.source?.value || properties.background?.image?.value) {
    return "suggest_image"
  }

  if (properties.content?.value) {
    return "suggest_text"
  }

  return null
}
