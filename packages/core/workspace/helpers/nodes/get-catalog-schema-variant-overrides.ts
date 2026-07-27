import { getComponentSchema } from "../../../components/catalog"
import { componentBoardSchemaVariantNodeId } from "../components/entry-node-ids"

import type { ComponentId } from "../../../components/constants"
import type { Properties } from "../../../properties/types/properties"

/**
 * Returns catalog `variants[i].overrides` when `nodeId` is a fixed schema variant root.
 */
export function getCatalogSchemaVariantOverridesForNode(
  nodeId: string,
  componentId: ComponentId,
): Properties {
  const schema = getComponentSchema(componentId)

  for (const variant of schema.variants ?? []) {
    if (componentBoardSchemaVariantNodeId(componentId, variant.id) === nodeId) {
      return (variant.overrides ?? {}) as Properties
    }
  }

  return {}
}
