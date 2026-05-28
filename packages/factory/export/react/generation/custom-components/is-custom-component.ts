import {
  nodeRetrievalService,
  typeCheckingService,
} from "@seldon/core/workspace/services"
import { Instance, Variant, Workspace } from "@seldon/core/workspace/types"
import { ComponentToExport } from "../../../types"
import { isInlineComponent } from "../inline-components/is-inline-component"

/**
 * Custom Component:
 * Generated from custom variants (type: "userVariant")
 *
 * Components that are generated from custom variants in the workspace.
 * These are created by users when they need a component to behave differently
 * from the default variant.
 *
 * Key characteristics:
 * - Custom variant: Variant has type === "userVariant"
 * - Not inline: Component does not have Frame as direct child
 * - User-created: Created by users for component customization
 *
 */
export function isCustomComponent(
  component: ComponentToExport,
  workspace: Workspace,
): boolean {
  // First check if it's inline - if so, it's not a custom component
  if (isInlineComponent(component)) {
    return false
  }

  // Get the variant from workspace
  let variant: Variant | Instance
  try {
    variant = nodeRetrievalService.getNode(component.variantId, workspace)
  } catch {
    // If variant is not found, it's not a custom component
    return false
  }

  // Check if variant is custom variant (user variant)
  return typeCheckingService.isUserVariant(variant)
}
