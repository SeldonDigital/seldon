import { InstanceId, VariantId } from "@seldon/core"

import { NodeIdToClass } from "../../css/types"
import { ComponentToExport } from "../../types"

/**
 * Get the class name for a specific node ID from the nodeIdToClass mapping
 */
export function getClassName(
  nodeId: string,
  nodeIdToClass: Record<string, string | null | undefined>,
): string | null | undefined {
  return nodeIdToClass[nodeId]
}

/**
 * Get the variant class names for a component
 * Custom variants have complete styles, so they don't need the default variant class.
 */
export function getVariantClassNames(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
): string {
  const { variantId } = component
  const map = (id: InstanceId | VariantId) => nodeIdToClass[id as string]

  // Always use only the variant's own class (custom variants have complete styles)
  return map(variantId) || ""
}
