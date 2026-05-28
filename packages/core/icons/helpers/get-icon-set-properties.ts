import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId } from "@seldon/core/components/constants"
import { mergeProperties } from "@seldon/core/properties/helpers/merge-properties"
import { Properties } from "@seldon/core/properties/types/properties"
import { getEffectiveNodeProperties } from "@seldon/core/workspace/compute"
import type { Board, Workspace } from "@seldon/core/workspace/types"
import { isIconSetVariant } from "./is-icon-set-variant"

type IconSetWorkspaceNode = { id: string; type?: string; properties?: Properties }

export function getIconSetProperties(
  variant: IconSetWorkspaceNode,
  board: Board,
  workspace: Workspace,
): Properties {
  if (!isIconSetVariant(variant, workspace)) {
    return getEffectiveNodeProperties(variant.id, workspace)
  }

  const iconSchema = getComponentSchema(ComponentId.ICON)
  if (!iconSchema) {
    return variant.properties || {}
  }

  const schemaProperties = iconSchema.properties

  const variantProperties = variant.properties || {}
  const mergedProperties = mergeProperties(schemaProperties, variantProperties)

  return mergedProperties
}
