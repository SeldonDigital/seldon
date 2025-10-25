import { getComponentSchema } from "../../../../components/catalog"
import { ComponentId } from "../../../../components/constants"
import {
  Instance,
  InstanceId,
  ReferenceId,
  Variant,
  VariantId,
  Workspace,
} from "../../../types"

export type ReferenceMap = Record<ReferenceId, VariantId | InstanceId>

/**
 * The AI needs a stable reference map to be able to reference an added component without receiving the
 * actual workspace. E.g. the AI can send a list of actions (first ai_add_component, then ai_set_node_properties)
 * the reference map is then used to update the workspace with the set_node_properties action.
 *
 * The reference map is basically a key value pair of the reference and the actual id in the workspace.
 *
 * Simplified example of a productcard:
 *
 * ai_add_component
 *   componentId: "cardProduct"
 *   id: "$ref"
 *
 * ProductCard: $ref
 *   TextblockDetails: $ref.0
 *    Title: $ref.0.1
 *   ButtonBar: $ref.1
 *    Button: $ref.1.0
 *      LabelButton: $ref.1.0.0
 *      Icon: $ref.1.0.1
 *
 * The reference map will then be:
 *
 * {
 *   "$ref": "variant-cardProduct-default",
 *   "$ref.0": "child-textblockDetails-x",
 *   "$ref.0.1": "child-title-x",
 *   "$ref.1": "child-buttonBar-x",
 * }
 *
 * In subsequent actions, the AI will return $ref.x as the nodeId which we can replace using the map
 * @param ref referenceId
 * @param addedNodeId variantId or childId of the added component
 * @param workspace workspace
 * @returns reference map
 */
export function getReferenceMap(
  ref: ReferenceId,
  addedNodeId: VariantId | InstanceId,
  workspace: Workspace,
): ReferenceMap {
  const map: ReferenceMap = {
    [ref]: addedNodeId,
  }

  function traverse(id: VariantId | InstanceId, parentLevel: ReferenceId) {
    const variant = workspace.byId[id]
    map[parentLevel] = id

    if (variant.children) {
      variant.children.forEach((childId, index) => {
        const childLevel: ReferenceId = `${parentLevel}.${index}`
        traverse(childId, childLevel)
      })
    }
  }

  const variant = workspace.byId[addedNodeId]
  variant.children?.forEach((childId, index) => {
    traverse(childId, `${ref}.${index}`)
  })

  return map
}

/**
 * Generate a schema-aware reference map that includes expected reference IDs
 * even if some nodes don't exist in the actual workspace
 * This works generically for any component type and any depth of hierarchy
 */
export function getSchemaAwareReferenceMap(
  ref: ReferenceId,
  addedNodeId: VariantId | InstanceId,
  workspace: Workspace,
): ReferenceMap {
  const map: ReferenceMap = {
    [ref]: addedNodeId,
  }

  // Validate that the added node exists in workspace
  const addedNode = workspace.byId[addedNodeId]
  if (!addedNode) {
    return map
  }

  // Get component ID from the node to validate schema exists
  const componentId = getComponentIdFromNode(addedNodeId, workspace)
  if (!componentId) {
    return map
  }

  // Validate schema exists before proceeding
  const schema = getComponentSchema(componentId)
  if (!schema) {
    return map
  }

  // Build reference map for the variant and its complete hierarchy
  buildReferenceMapForVariant(ref, addedNodeId, workspace, map)

  // Validate the generated reference map against actual workspace structure
  validateReferenceMapConsistency(map, workspace, componentId)

  return map
}

/**
 * Build reference map for any component variant and its complete hierarchy
 * This works generically for any component type and any depth
 */
function buildReferenceMapForVariant(
  baseRef: ReferenceId,
  variantId: VariantId | InstanceId,
  workspace: Workspace,
  referenceMap: ReferenceMap,
): void {
  const variant = workspace.byId[variantId]
  if (!variant) {
    return
  }

  // Add the variant itself to the map
  referenceMap[baseRef] = variantId

  // Recursively build references for all children
  if (variant.children && variant.children.length > 0) {
    variant.children.forEach((childId, index) => {
      const childRef: ReferenceId = `${baseRef}.${index}`
      const child = workspace.byId[childId]

      if (child) {
        // Add the child to the map
        referenceMap[childRef] = childId

        // Recursively build references for the child's children
        buildReferenceMapForVariant(childRef, childId, workspace, referenceMap)
      } else {
      }
    })
  }
}

/**
 * Build reference map for a specific component type with expected structure
 * This can be used to create references for components that don't exist yet
 */
export function buildExpectedReferenceMap(
  baseRef: ReferenceId,
  componentId: ComponentId,
  expectedStructure: any,
  workspace: Workspace,
): ReferenceMap {
  const map: ReferenceMap = {}

  // Validate schema exists before building expected references
  let schema
  try {
    schema = getComponentSchema(componentId)
  } catch (error) {
    return map
  }

  if (!schema) {
    return map
  }

  // Validate expected structure is valid
  if (!expectedStructure || typeof expectedStructure !== "object") {
    return map
  }

  // Build references based on the expected structure
  buildReferencesFromStructure(baseRef, componentId, expectedStructure, map, 0)

  return map
}

/**
 * Build references from a component structure
 */
function buildReferencesFromStructure(
  baseRef: ReferenceId,
  componentId: ComponentId,
  structure: any,
  map: ReferenceMap,
  depth: number,
): void {
  // Limit recursion depth to prevent infinite loops
  if (depth > 10) {
    return
  }

  // Get the component schema to understand the expected structure
  let schema
  try {
    schema = getComponentSchema(componentId)
  } catch (error) {
    return
  }

  if (!schema) {
    return
  }

  // If the structure has children, build references for them
  if (structure.children && Array.isArray(structure.children)) {
    structure.children.forEach((child: any, index: number) => {
      const childRef: ReferenceId = `${baseRef}.${index}`

      // Try to determine the child component type
      const childComponentId = determineChildComponentType(child, schema, index)
      if (childComponentId) {
        // Recursively build references for the child
        buildReferencesFromStructure(
          childRef,
          childComponentId,
          child,
          map,
          depth + 1,
        )
      } else {
      }
    })
  }
}

/**
 * Determine the component type for a child based on structure and schema
 */
function determineChildComponentType(
  child: any,
  parentSchema: any,
  index: number,
): ComponentId | null {
  // If the child has a component property, use it
  if (child.component) {
    return child.component
  }

  // If the parent schema has children, try to match by index
  if (parentSchema.children && parentSchema.children[index]) {
    return parentSchema.children[index].component
  }

  // If the child has properties that suggest a component type, infer it
  if (child.properties) {
    // This is a simplified inference - in practice, you might want more sophisticated logic
    if (child.properties.symbol) {
      return ComponentId.ICON
    }
    if (child.properties.content) {
      return ComponentId.LABEL
    }
  }

  return null
}

/**
 * Get component ID from a node in the workspace
 */
function getComponentIdFromNode(
  nodeId: VariantId | InstanceId,
  workspace: Workspace,
): ComponentId | null {
  const node = workspace.byId[nodeId]
  if (!node) return null

  // If it's a variant, get the component ID from the board
  if (
    "type" in node &&
    (node.type === "defaultVariant" || node.type === "userVariant")
  ) {
    // Find the board that contains this variant
    for (const [componentId, board] of Object.entries(workspace.boards)) {
      if (board.variants.includes(nodeId as VariantId)) {
        return componentId as ComponentId
      }
    }

    // For custom variants, try to extract component ID from the variant ID
    // Custom variants follow the pattern: variant-{componentId}-custom-{timestamp}
    if (nodeId.startsWith("variant-") && nodeId.includes("-custom-")) {
      const customIndex = nodeId.indexOf("-custom-")
      if (customIndex > 0) {
        const componentId = nodeId.substring(7, customIndex) as ComponentId // Remove 'variant-' prefix
        // Validate that this is a real component ID by checking if schema exists
        try {
          const schema = getComponentSchema(componentId)
          if (schema) {
            return componentId
          }
        } catch (error) {
          // Component ID is invalid, continue with other methods
        }
      }
    }
  }

  // If it's an instance, get the component ID from the variant
  if ("variant" in node) {
    const variantId = node.instanceOf
    const variant = workspace.byId[variantId]
    if (
      variant &&
      "type" in variant &&
      (variant.type === "defaultVariant" || variant.type === "userVariant")
    ) {
      // Find the board that contains this variant
      for (const [componentId, board] of Object.entries(workspace.boards)) {
        if (board.variants.includes(variantId as VariantId)) {
          return componentId as ComponentId
        }
      }

      // For custom variants, try to extract component ID from the variant ID
      if (variantId.startsWith("variant-") && variantId.includes("-custom-")) {
        const customIndex = variantId.indexOf("-custom-")
        if (customIndex > 0) {
          const componentId = variantId.substring(7, customIndex) as ComponentId // Remove 'variant-' prefix
          // Validate that this is a real component ID by checking if schema exists
          try {
            const schema = getComponentSchema(componentId)
            if (schema) {
              return componentId
            }
          } catch (error) {
            // Component ID is invalid, continue with other methods
          }
        }
      }
    }
  }

  return null
}

/**
 * Validate that the generated reference map is consistent with the actual workspace structure
 */
function validateReferenceMapConsistency(
  referenceMap: ReferenceMap,
  workspace: Workspace,
  componentId: ComponentId,
): void {
  let schema
  try {
    schema = getComponentSchema(componentId)
  } catch (error) {
    return
  }

  if (!schema) {
    return
  }

  // Check that all references in the map point to existing nodes
  for (const [ref, nodeId] of Object.entries(referenceMap)) {
    const node = workspace.byId[nodeId]
    if (!node) {
    }
  }

  // Check that the reference map structure matches the expected schema structure
  const expectedStructure = convertSchemaToStructure(schema)
  validateReferenceMapAgainstStructure(
    referenceMap,
    expectedStructure,
    componentId,
  )
}

/**
 * Convert a component schema to a structure for validation
 */
function convertSchemaToStructure(schema: any): any {
  if (!schema || !schema.children) {
    return { component: schema?.component, children: [], properties: {} }
  }

  return {
    component: schema.component,
    children: schema.children.map((child: any) =>
      convertSchemaToStructure(child),
    ),
    properties: schema.properties || {},
  }
}

/**
 * Validate that reference map matches the expected structure
 */
function validateReferenceMapAgainstStructure(
  referenceMap: ReferenceMap,
  expectedStructure: any,
  componentId: ComponentId,
): void {
  if (!expectedStructure || !expectedStructure.children) return

  // Find the base reference from the reference map
  const baseRef = Object.keys(referenceMap).find(
    (ref) => !ref.includes(".") && ref.startsWith("$ref"),
  )

  if (!baseRef) {
    // No base reference found, skip validation
    return
  }

  // Check that we have references for all expected children
  expectedStructure.children.forEach((child: any, index: number) => {
    const expectedRef = `${baseRef}.${index}` as ReferenceId
    if (!referenceMap[expectedRef]) {
    }
  })
}
