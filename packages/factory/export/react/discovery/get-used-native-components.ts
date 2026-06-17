import { Workspace } from "@seldon/core"
import { isComponentId } from "@seldon/core/components/constants"
import { HtmlElement } from "@seldon/core/properties"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"

import { getWorkspaceNodeList } from "../../../helpers/workspace-nodes"
import { HTML_ELEMENT_OPTIONS } from "./html-element-options"

export function getUsedNativeComponents(
  workspace: Workspace,
): Set<HtmlElement> {
  const usedElements = new Set<HtmlElement>()

  for (const node of getWorkspaceNodeList(workspace)) {
    const properties = getNodeProperties(node, workspace)
    if (properties.htmlElement?.value) {
      usedElements.add(properties.htmlElement.value as HtmlElement)
    }

    const catalogId = getNodeCatalogId(node, workspace)
    if (!catalogId || !isComponentId(catalogId)) continue

    const options = HTML_ELEMENT_OPTIONS[catalogId]
    if (options) {
      for (const value of options) {
        usedElements.add(value)
      }
    }
  }

  return usedElements
}
