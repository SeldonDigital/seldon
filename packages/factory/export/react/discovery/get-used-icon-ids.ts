import { ValueType, Workspace } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { isComponentId } from "@seldon/core/components/constants"
import { IconId } from "@seldon/core/icon-sets"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { getWorkspaceNodeList } from "../../../helpers/workspace-nodes"

export function getUsedIconIds(workspace: Workspace): Set<IconId> {
  const usedIcons = new Set<IconId>(["__default__"])

  for (const node of getWorkspaceNodeList(workspace)) {
    const properties = getNodeProperties(node, workspace)
    if (
      properties?.symbol?.value &&
      properties.symbol.type === ValueType.OPTION
    ) {
      usedIcons.add(properties.symbol.value as IconId)
    }

    const catalogId = getNodeCatalogId(node, workspace)
    if (!catalogId || !isComponentId(catalogId)) continue

    const schema = getComponentSchema(catalogId)
    if (!("default" in schema)) continue

    const walkSchemaChildren = (
      children: typeof schema.default.children,
    ) => {
      if (!children) return
      for (const child of children) {
        const symbolOverride = child.overrides?.symbol
        if (
          symbolOverride &&
          symbolOverride.type === ValueType.EXACT &&
          typeof symbolOverride.value === "string"
        ) {
          usedIcons.add(symbolOverride.value as IconId)
        }
        if (child.children) {
          walkSchemaChildren(child.children)
        }
      }
    }

    walkSchemaChildren(schema.default.children)
    if ("variants" in schema && schema.variants) {
      for (const variant of schema.variants) {
        walkSchemaChildren(variant.children)
      }
    }
  }

  return usedIcons
}
