/**
 * Reads a subject's schema property keys and resolves a property value for
 * display. Both are leaf helpers shared by the row factory, the border-side
 * rows, and the flatten orchestrator.
 */
import { getCompoundLayerValue } from "@seldon/editor/lib/properties/property-paths"
import { getNodeCatalogComponentId } from "@seldon/editor/lib/workspace/node-tree"
import type {
  Board,
  Instance,
  Properties,
  Variant,
  Workspace,
} from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { isComponentId } from "@seldon/core/components/constants"
import { findInObject } from "@seldon/core/helpers"
import { isLayeredPaintProperty } from "@seldon/core/properties/types/property-keys"
import type { PropertyKey as CorePropertyKey } from "@seldon/core/properties/types/property-keys"
import { getComponentPropertyDefaults } from "@seldon/core/workspace/helpers/components/get-component-property-defaults"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"

export function getSchemaPropertyKeysForSubject(
  node: Variant | Instance | Board,
  workspace: Workspace,
): string[] {
  if (isBoard(node)) {
    return Object.keys(getComponentPropertyDefaults())
  }

  const catalogId = getNodeCatalogComponentId(node, workspace)
  if (catalogId && isComponentId(catalogId)) {
    return Object.keys(getComponentSchema(catalogId).properties)
  }

  return []
}

export function resolvePropertyValueForDisplay(
  mergedProperties: Properties,
  propertyKey: string,
): unknown {
  const direct = findInObject(mergedProperties, propertyKey)
  if (direct !== undefined && direct !== null) {
    return direct
  }

  if (isLayeredPaintProperty(propertyKey as CorePropertyKey)) {
    return getCompoundLayerValue(
      mergedProperties[propertyKey as keyof Properties],
    )
  }

  return undefined
}
