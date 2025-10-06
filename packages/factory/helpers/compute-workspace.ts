import { produce } from "immer"
import {
  Instance,
  InstanceId,
  Properties,
  Variant,
  VariantId,
  Workspace,
} from "@seldon/core"
import { computeProperties } from "@seldon/core/compute/compute-properties"
import { findParentNode } from "@seldon/core/workspace/helpers/find-parent-node"
import { getNodeProperties } from "@seldon/core/workspace/helpers/get-node-properties"
import { themeService } from "@seldon/core/workspace/services/theme.service"
import { StyleGenerationContext } from "../styles/types"

/**
 * Computes an entire workspace for further processing
 * And adds all properties to a single node. So if a node is an instance
 * it will also add the properties of the parent node(s).
 */
export function computeWorkspace(workspace: Workspace): Workspace {
  return produce(workspace, (draft) => {
    // We are storing the computed properties separately because we dont want that the computations of childs use the
    // already computed properties of the parent.
    // IE, after computing an original node, its value wont be COMPUTED anymore, but some exact value. An instance looking up the properties of the original for inheritance will not inherit COMPUTED in that case, which is faulty.
    const computedPropertiesRecord: Record<VariantId | InstanceId, Properties> =
      {}

    const nodes = Object.values(draft.byId)

    for (const node of nodes) {
      const computedProperties = computeProperties(
        node.properties,
        buildContext(node, draft),
      )

      computedPropertiesRecord[node.id] = computedProperties
    }

    // Now reassign the computed properties to the workspace
    const propertiesById = Object.entries(computedPropertiesRecord)
    for (const [id, properties] of propertiesById) {
      draft.byId[id].properties = properties
    }
  })
}

export const buildContext = (
  node: Variant | Instance,
  workspace: Workspace,
) => {
  const getProperties = (node: Variant | Instance): StyleGenerationContext => {
    const parent = findParentNode(node.id, workspace)

    return {
      properties: getNodeProperties(node, workspace),
      parentContext: parent ? getProperties(parent) : null,
      theme: themeService.getNodeTheme(node.id, workspace),
    }
  }

  return getProperties(node)
}
