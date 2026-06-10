import { ComponentId } from "../../../components/constants"
import { isComponentId } from "../../../components/constants"
import { findInObject } from "../../../helpers/utils/find-in-object"
import { mergeProperties } from "../../../properties/helpers/merge-properties"
import type { Properties } from "../../../properties/types/properties"
import { isLayeredPaintProperty } from "../../../properties/types/property-keys"
import type {
  PropertyKey,
  SubPropertyKey,
} from "../../../properties/types/property-keys"
import { getInheritedNodeProperties } from "../../compute/compute-node-properties"
import type { EntryNode, Workspace } from "../../types"
import { getCompoundLayerValue } from "../properties/shared"
import { getCatalogSchemaVariantOverridesForNode } from "./get-catalog-schema-variant-overrides"
import { getNodeCatalogId } from "./get-node-catalog-id"

export type NodePropertyResetPatch =
  | { action: "delete" }
  | { action: "delete-sub" }
  | { action: "set"; properties: Properties }

function propertySlicesMatch(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

function getBaselineProperties(
  node: EntryNode,
  workspace: Workspace,
  componentId: ComponentId,
): Properties {
  const inherited = getInheritedNodeProperties(node.id, workspace)
  const catalogVariantOverrides = getCatalogSchemaVariantOverridesForNode(
    node.id,
    componentId,
  )
  return mergeProperties(inherited, catalogVariantOverrides)
}

function readPropertySlice(
  properties: Properties,
  propertyKey: PropertyKey,
  subpropertyKey?: SubPropertyKey,
): unknown {
  if (!subpropertyKey) {
    return properties[propertyKey as keyof Properties]
  }

  const bag = properties[propertyKey as keyof Properties]
  if (isLayeredPaintProperty(propertyKey)) {
    return getCompoundLayerValue(bag)?.[subpropertyKey]
  }

  if (
    bag &&
    typeof bag === "object" &&
    !Array.isArray(bag) &&
    !("type" in bag)
  ) {
    return (bag as Record<string, unknown>)[subpropertyKey]
  }

  if (!bag || typeof bag !== "object") {
    return undefined
  }

  return findInObject(bag, subpropertyKey)
}

function buildSetPatch(
  propertyKey: PropertyKey,
  subpropertyKey: SubPropertyKey | undefined,
  value: unknown,
): Properties {
  if (!subpropertyKey) {
    return { [propertyKey]: value } as Properties
  }

  if (isLayeredPaintProperty(propertyKey)) {
    const layer = { [subpropertyKey]: value }
    return { [propertyKey]: [layer] } as Properties
  }

  return {
    [propertyKey]: { [subpropertyKey]: value },
  } as Properties
}

/**
 * Resolves how to update `node.overrides` when resetting a property to its variant baseline.
 */
export function resolveNodePropertyResetPatch(
  node: EntryNode,
  workspace: Workspace,
  propertyKey: PropertyKey,
  subpropertyKey?: SubPropertyKey,
): NodePropertyResetPatch {
  const catalogId = getNodeCatalogId(node, workspace)
  if (!catalogId || !isComponentId(catalogId)) {
    return subpropertyKey ? { action: "delete-sub" } : { action: "delete" }
  }

  const inherited = getInheritedNodeProperties(node.id, workspace)
  const baseline = getBaselineProperties(node, workspace, catalogId)
  const baselineSlice = readPropertySlice(baseline, propertyKey, subpropertyKey)
  const inheritedSlice = readPropertySlice(
    inherited,
    propertyKey,
    subpropertyKey,
  )

  if (propertySlicesMatch(baselineSlice, inheritedSlice)) {
    return subpropertyKey ? { action: "delete-sub" } : { action: "delete" }
  }

  if (baselineSlice === undefined) {
    return subpropertyKey ? { action: "delete-sub" } : { action: "delete" }
  }

  return {
    action: "set",
    properties: buildSetPatch(propertyKey, subpropertyKey, baselineSlice),
  }
}
