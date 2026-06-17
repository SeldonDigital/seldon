import { getComponentSchema } from "../../../components/catalog"
import { isComponentId } from "../../../components/constants"
import { Properties } from "../../../properties"
import { mergeProperties } from "../../../properties/helpers/merge-properties"
import { Board, EntryNode, Workspace, parseNodeTemplate } from "../../types"
import { getComponentPropertyDefaults } from "../components/get-component-property-defaults"
import { isBoard } from "../components/is-board"
import { getNodeCatalogId } from "./get-node-catalog-id"

/**
 * Gets the properties for a node by merging schema properties with instance inheritance chain.
 * For instances, traverses up the inheritance chain to merge properties from the original variant.
 * @param node - The node to get properties for
 * @param workspace - The workspace containing the nodes
 * @returns Merged properties from schema and inheritance chain
 */
export function getNodeProperties(
  node: EntryNode | Board,
  workspace: Workspace,
): Properties {
  if (isBoard(node)) {
    const defaults = getComponentPropertyDefaults()
    return mergeProperties(defaults, node.componentProperties)
  }

  const catalogId = getNodeCatalogId(node, workspace)
  let schemaProperties: Properties = {}
  if (catalogId && isComponentId(catalogId)) {
    const schema = getComponentSchema(catalogId)
    schemaProperties = schema.properties
  }

  const chain: EntryNode[] = []
  const visited = new Set<string>()
  let cursor: EntryNode | null = node

  while (cursor && !visited.has(cursor.id)) {
    visited.add(cursor.id)
    chain.push(cursor)
    const parsed = parseNodeTemplate(cursor.template)
    if (!parsed || parsed.kind !== "node") break
    cursor = workspace.nodes[parsed.nodeId] ?? null
  }

  const inheritedOverrides = chain
    .reverse()
    .reduce<Properties>((acc, item) => mergeProperties(acc, item.overrides), {})

  return mergeProperties(schemaProperties, inheritedOverrides)
}
