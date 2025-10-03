import { getComponentSchema } from "../../components/catalog"
import { processNestedOverridesProps } from "../../helpers/properties/process-nested-overrides-props"
import { removeAllowedValuesFromProperties } from "../../helpers/properties/remove-allowed-values"
import { Board, Instance, Variant, Workspace } from "../../index"
import { Properties } from "../../properties"
import { DEFAULT_BOARD_PROPERTIES } from "../../properties/constants/default-board-properties"
import { mergeProperties } from "../../properties/helpers/merge-properties"
import { getNodeById } from "./get-node-by-id"
import { isBoard } from "./is-board"

/**
 * Gets the properties for a node by merging schema properties with instance inheritance chain.
 * For instances, traverses up the inheritance chain to merge properties from the original variant.
 * @param node - The node to get properties for
 * @param workspace - The workspace containing the nodes
 * @returns Merged properties from schema and inheritance chain
 */
export function getNodeProperties(
  node: Variant | Instance | Board,
  workspace: Workspace,
): Properties {
  if (isBoard(node)) {
    return mergeProperties(DEFAULT_BOARD_PROPERTIES, node.properties)
  }

  const schema = getComponentSchema(node.component)
  if (!schema) {
    console.warn(
      `Schema not found for component ${node.component}, returning empty properties`,
    )
    return node.properties || {}
  }
  const schemaProperties = removeAllowedValuesFromProperties(schema.properties)

  let original = node
  let mergedProperties = node.properties

  while ("instanceOf" in original && original.instanceOf) {
    original = getNodeById(original.instanceOf, workspace)
    mergedProperties = mergeProperties(original.properties, mergedProperties)
  }

  mergedProperties = mergeProperties(schemaProperties, mergedProperties)

  return mergedProperties
}

/**
 * Gets properties for a child component by processing nested override props.
 * @param child - The child component with potential overrides
 * @param parentOverride - Optional parent override properties
 * @param componentId - Optional component ID for processing
 * @returns Processed child properties
 */
export function getChildProperties(
  child: any,
  parentOverride?: Record<string, any>,
  componentId?: string,
): Properties {
  if (!child.overrides) {
    return {}
  }

  return processNestedOverridesProps(
    child.overrides,
    parentOverride,
    componentId,
  )
}
