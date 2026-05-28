import { Workspace } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { isComponentId } from "@seldon/core/components/constants"
import { HtmlElement } from "@seldon/core/properties"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { getWorkspaceNodeList } from "../../../helpers/workspace-nodes"

export function getUsedNativeComponents(workspace: Workspace): Set<HtmlElement> {
  const usedElements = new Set<HtmlElement>()

  for (const node of getWorkspaceNodeList(workspace)) {
    const properties = getNodeProperties(node, workspace)
    if (properties.htmlElement?.value) {
      usedElements.add(properties.htmlElement.value as HtmlElement)
    }

    const catalogId = getNodeCatalogId(node, workspace)
    if (!catalogId || !isComponentId(catalogId)) continue

    const schema = getComponentSchema(catalogId)
    const allowed = schema.properties.htmlElement?.restrictions?.allowedValues
    if (allowed) {
      for (const value of allowed) {
        usedElements.add(value as HtmlElement)
      }
    }
  }

  return usedElements
}
