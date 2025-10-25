import { getComponentSchema } from "../../components/catalog"
import { ComponentId, isComponentId } from "../../components/constants"
import { processNestedOverridesProps } from "../../helpers/properties/process-nested-overrides-props"
import { removeAllowedValuesFromProperties } from "../../helpers/properties/remove-allowed-values"
import { Board, Instance, Variant, Workspace } from "../../index"
import { Properties } from "../../properties"
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
  // Boards always use the Board schema, regardless of their component field
  const componentId = isBoard(node) ? ComponentId.BOARD : node.component

  // Validate component ID before trying to get schema
  if (!isComponentId(componentId)) {
    console.warn(
      `Invalid component ID: ${componentId}. Falling back to node properties.`,
    )
    return node.properties || {}
  }

  const schema = getComponentSchema(componentId)
  if (!schema) {
    return node.properties || {}
  }
  let schemaProperties: Properties
  try {
    schemaProperties = removeAllowedValuesFromProperties(schema.properties)
  } catch (error) {
    // If we get a circular reference error from Immer, use the original properties
    if (
      error instanceof Error &&
      (error.message.includes("Maximum call stack size exceeded") ||
        error.message.includes("Circular reference"))
    ) {
      schemaProperties = schema.properties
    } else {
      throw error
    }
  }

  // Boards don't inherit from variants - they only use their own properties + schema
  if (isBoard(node)) {
    return mergeProperties(schemaProperties, node.properties)
  }

  // For variants and instances, do the inheritance chain traversal
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
