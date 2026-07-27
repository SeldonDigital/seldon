import { Orientation } from "@seldon/core"
import type { ComponentId } from "@seldon/core/components/constants"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { nodeRetrievalService } from "@seldon/core/workspace/services"
import type {
  InstanceId,
  VariantId,
  Workspace,
} from "@seldon/core/workspace/types"

/**
 * Resolves layout orientation for canvas insert indicators and hover placement.
 */
export function getNodeOrientation(
  objectId: ComponentId | VariantId | InstanceId,
  workspace: Workspace,
): "horizontal" | "vertical" {
  const node = nodeRetrievalService.getObject(objectId, workspace)
  const properties = getNodeProperties(node, workspace)
  const value = properties.orientation?.value

  if (value === Orientation.HORIZONTAL) {
    return "horizontal"
  }

  return "vertical"
}
