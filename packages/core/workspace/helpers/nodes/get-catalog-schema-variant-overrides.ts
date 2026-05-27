import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import { isComplexSchema } from "../../../components/types"
import type { Properties } from "../../../properties/types/properties"
import { componentBoardSchemaVariantNodeId } from "../components/entry-node-ids"

/**
 * Returns catalog `variants[i].overrides` when `nodeId` is a fixed schema variant root.
 */
export function getCatalogSchemaVariantOverridesForNode(
  nodeId: string,
  componentId: ComponentId,
): Properties {
  const schema = getComponentSchema(componentId)
  if (!isComplexSchema(schema)) {
    return {}
  }

  for (const variant of schema.variants ?? []) {
    if (componentBoardSchemaVariantNodeId(componentId, variant.id) === nodeId) {
      return (variant.overrides ?? {}) as Properties
    }
  }

  return {}
}
