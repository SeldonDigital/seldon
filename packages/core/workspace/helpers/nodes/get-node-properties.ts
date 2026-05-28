import { getComponentSchema } from "../../../components/catalog"
import { isComponentId } from "../../../components/constants"
import { Properties } from "../../../properties"
import { mergeProperties } from "../../../properties/helpers/merge-properties"
import { ComponentEntry, EntryNode, Workspace, parseNodeTemplate } from "../../types"
import { getComponentPropertyDefaults } from "../components/get-component-property-defaults"
import { getNodeCatalogId } from "./get-node-catalog-id"
import { isComponentEntry } from "../components/is-component-entry"

/**
 * Gets the properties for a node by merging schema properties with instance inheritance chain.
 * For instances, traverses up the inheritance chain to merge properties from the original variant.
 * @param node - The node to get properties for
 * @param workspace - The workspace containing the nodes
 * @returns Merged properties from schema and inheritance chain
 */
export function getNodeProperties(
  node: EntryNode | ComponentEntry,
  workspace: Workspace,
): Properties {
  if (isComponentEntry(node)) {
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

/**
 * Merges optional parent override map with the child's flat `overrides`.
 * Only flat `Properties` maps are supported (no keyed-by-child-id nested override maps).
 */
export function getChildProperties(
  child: { overrides?: Properties },
  parentOverride?: Record<string, unknown>,
  _componentId?: string,
): Properties {
  const own = child.overrides ?? {}
  const parent = (parentOverride ?? {}) as Properties
  return mergeProperties(parent, own)
}
