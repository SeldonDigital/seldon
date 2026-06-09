import {
  nodeRetrievalService,
  typeCheckingService,
} from "@seldon/core/workspace/services"
import { Instance, Variant, Workspace } from "@seldon/core/workspace/types"

import { ComponentToExport } from "../../../types"
import { validateExportedComponentProps } from "../../validation/validate-component-props"
import { isInlineComponent } from "../inline-components/is-inline-component"

/**
 * Default Component:
 * Generated from default variants (type: "defaultVariant")
 *
 * Components that are generated from default variants in the workspace.
 * These represent the canonical version of a component as defined by its schema.
 *
 * Key characteristics:
 * - Default variant: Variant has type === "defaultVariant"
 * - Not inline: Component does not have Frame as direct child
 * - Schema-based: Created automatically from component schemas
 * - Schema validation: All children must match schema-defined children (can be reordered, properties can be overridden)
 * - Fewer children allowed: Can have fewer children than schema if some are excluded (display: EXCLUDE)
 *
 */
export function isDefaultComponent(
  component: ComponentToExport,
  workspace: Workspace,
): boolean {
  // First check if it's inline - if so, it's not a default component
  if (isInlineComponent(component)) {
    return false
  }

  // Get the variant from workspace
  let variant: Variant | Instance
  try {
    variant = nodeRetrievalService.getNode(component.variantId, workspace)
  } catch {
    // If variant is not found, it's not a default component
    return false
  }

  // Check if variant is default variant
  if (!typeCheckingService.isDefaultVariant(variant)) {
    return false
  }

  // If no children, it's a default component (simple component)
  if (!Array.isArray(component.tree.children)) {
    return true
  }

  // Validate direct children props against schema
  const validation = validateExportedComponentProps(component)

  // Default components must have all valid props matching the schema
  // (no invalid props, but can have fewer props if some are excluded)
  return validation.invalidProps.length === 0
}
